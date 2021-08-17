import config from "./config.json";
import csv = require('csv-parser');
import fs = require('fs')


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

interface RelevantFieldCache {
    [key: string]: {
        [relevantField: string]: string | number
    }
}

const cache: RelevantFieldCache = {};

(async () => {
    for(const inputFilename of inputFilenames) {
        await new Promise<void>(resolve => {
            fs.createReadStream(inputFilename)
                .pipe(csv())
                .on('data', (data) => {
                    const joinValue = data[joinField]
                    if(joinValue != null) {
                        if(!cache[joinValue]) {
                            cache[joinValue] = {};
                        }
                        
                        for (const relevantField of [...relevantFields]) {
                            if(data[relevantField]) {
                                if(!isNaN(Number(data[relevantField]))) {
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
})()

