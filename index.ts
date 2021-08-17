import config from "./config.json";
import csv = require('csv-parser');


const { inputFilenames, joinField, outputFields, outputFile } = config;

const relevantFields: Set<string> = Object.values(outputFields).reduce((acc, {input}) => {
    if(typeof input === 'string') {
        acc.add(input)
    }
    else {
        for(const val of input) {
            if(typeof val === 'string' && val.substring(0,2) !== "@@") {
                acc.add(val);
            }
        }
    }
    return acc;
}, new Set<string>())

console.log("Fields which are relevant to this curation process are: ")
console.log(relevantFields)


