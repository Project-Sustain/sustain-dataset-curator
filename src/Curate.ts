import csv = require('csv-parser');
import fs = require('fs')

interface RelevantFieldCache {
    [key: string]: {
        [relevantField: string]: string | number
    }
}

type MathOperator = "TIMES" | "DIVIDE" | "ADD" | "SUBTRACT" | "EXPONATE" | null;

interface OutputField {
    type: "copy" | "math",
    input: string | (number | string)[],
    label?: string,
    toInt?: "FLOOR" | "ROUND"
}

export interface ConfigInterface {
    inputFilenames: string[],
    outputFile: string,
    joinField: string,
    outputFields: {
        [fieldName: string]: OutputField
    }
}

export default async function Curate(config: ConfigInterface) {
    const { inputFilenames, joinField, outputFields, outputFile } = config;

    const relevantFields: Set<string> = Object.values(outputFields).reduce((acc, { input }) => {
        if (typeof input === 'string') {
            acc.add(input)
        }
        else {
            for (const val of input) {
                if (typeof val === 'string' && val.substring(0, 2) !== "@@") {
                    acc.add(val);
                }
            }
        }
        return acc;
    }, new Set<string>())

    console.log("Fields which are relevant to this curation process are: ")
    console.log(relevantFields)


    const cache: RelevantFieldCache = {};

    (async () => {
        for (const inputFilename of inputFilenames) {
            await new Promise<void>(resolve => {
                fs.createReadStream(inputFilename)
                    .pipe(csv())
                    .on('data', (data) => {
                        const joinValue = data[joinField]
                        if (joinValue != null) {
                            if (!cache[joinValue]) {
                                cache[joinValue] = {};
                            }

                            for (const relevantField of [...relevantFields]) {
                                if (data[relevantField]) {
                                    if (!isNaN(Number(data[relevantField]))) {
                                        data[relevantField] = Number(data[relevantField]);
                                    }
                                    cache[joinValue][relevantField] = data[relevantField];
                                }
                            }
                        }
                        else {
                            throw `Joinfield ${joinField} was missing from\n${JSON.stringify(data, null, 4)}`
                        }
                    })
                    .on('end', () => {
                        resolve();
                    });
            });
        }

        console.log("Cache is built, now building dataset")
        fs.writeFileSync(outputFile, '')
        fs.appendFileSync(outputFile, Object.keys(outputFields).join(',') + '\n');

        for (const relevantFields of Object.values(cache)) {
            let csvLine = '';
            for (const outputField of Object.values(outputFields) as OutputField[]) {
                if (outputField.type === 'copy' && typeof outputField.input === 'string') {
                    csvLine += relevantFields[outputField.input]
                }
                else if (outputField.type === 'math') {
                    let result: number = 0;
                    let recentOperator: MathOperator = null;
                    for (const step of outputField.input) {
                        if (typeof step === 'string' && step.substring(0, 2) === '@@') {
                            const operator = step.substring(2, step.length);
                            recentOperator = operator as MathOperator;
                            continue;
                        }

                        let num: number;
                        if (typeof step === 'number') {
                            num = step;
                        }
                        else if (typeof relevantFields[step] === 'number') {
                            num = relevantFields[step] as number;
                        }
                        else {
                            throw `Couldnt find ${step} in\n${JSON.stringify(relevantFields, null, 4)}`
                        }

                        if (!recentOperator) {
                            result = num;
                        }
                        else {
                            switch (recentOperator) {
                                case "ADD":
                                    result += num;
                                    break;
                                case "DIVIDE":
                                    if (result === 0 && num === 0) {
                                        result = 0;
                                    }
                                    else {
                                        result /= num;
                                    }
                                    break;
                                case "EXPONATE":
                                    result = Math.pow(result, num);
                                    break;
                                case "SUBTRACT":
                                    result -= num;
                                    break;
                                case "TIMES":
                                    result *= num;
                                    break;
                            }
                        }
                    }

                    if (outputField.toInt) {
                        switch (outputField.toInt) {
                            case "FLOOR":
                                result = Math.floor(result);
                                break;
                            case "ROUND":
                                result = Math.round(result);
                                break;
                        }
                    }

                    csvLine += result;
                }
                csvLine += ','
            }
            fs.appendFileSync(outputFile, csvLine.substring(0, csvLine.length - 1) + '\n')
        }
        console.log("Finished curating")
    })()
}