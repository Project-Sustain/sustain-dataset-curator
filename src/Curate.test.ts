import Curate, { ConfigInterface } from './Curate'
import fs = require('fs')

test('Curation single input', async () => {
    const config: ConfigInterface = {
        inputFilenames: ['./mock/tests.csv'],
        outputFile: './out/singleInputTestOutput.csv',
        joinField: "item",
        outputFields: {
            item: {
                type: 'copy',
                input: 'item'
            },
            itemCopy: {
                type: 'copy',
                input: 'item'
            },
            remainingTommorow: {
                type: 'math',
                input: ['stock', '@@SUBTRACT', 'demand']
            },
            profitPerDay: {
                type: 'math',
                input: ['demand', '@@TIMES', 'price']
            }
        }
    }
    await Curate(config)

    const fileStuff = fs.readFileSync(config.outputFile).toString();
    console.log(fileStuff)
    const fileStuffExpected = fs.readFileSync('./mock/singleInputTestOutput.csv').toString();

    expect(fileStuff).toBe(fileStuffExpected);
});

test('Curation multi input', async () => {
    const config: ConfigInterface = {
        inputFilenames: ['./mock/tests.csv', './mock/tests2.csv'],
        outputFile: './out/multiInputTestOutput.csv',
        joinField: "item",
        outputFields: {
            item: {
                type: 'copy',
                input: 'item'
            },
            itemCopy: {
                type: 'copy',
                input: 'item'
            },
            remainingTommorow: {
                type: 'math',
                input: ['stock', '@@SUBTRACT', 'demand']
            },
            profitPerDay: {
                type: 'math',
                input: ['demand', '@@TIMES', 'price']
            },
            tossedValue: {
                type: 'math',
                input: ['stock', '@@SUBTRACT', '@@(', 'demand', '@@TIMES', 'expireTime', '@@)', '@@TIMES', 'price']
            },
            unstockedValue: {
                type: 'math',
                input: ['@@(', "price", "@@TIMES", "demand", "@@TIMES", "expireTime", "@@)", "@@SUBTRACT", '@@(', 'stock', '@@TIMES', 'price', '@@)']
            },
            roundedOneQuarterPrice: {
                type: 'math',
                input: [1, '@@DIVIDE', 4, '@@TIMES', 'price'],
                toInt: 'ROUND'
            },
            flooredOneQuarterPrice: {
                type: 'math',
                input: [1, '@@DIVIDE', 4, '@@TIMES', 'price'],
                toInt: 'FLOOR'
            },
            priceDoubledAdd: {
                type: 'math',
                input: ['price', '@@ADD', 'price']
            },
            priceSquared: {
                type: 'math',
                input: ['price', '@@EXPONATE', 2]
            },
            someNumber: {
                type: 'math',
                input: ['price', '@@ADD', '@@(','price','@@SUBTRACT','@@(','price','@@TIMES','price','@@)','@@)']
            }
        }
    }
    await Curate(config)

    const fileStuff = fs.readFileSync(config.outputFile).toString();
    console.log(fileStuff)
    const fileStuffExpected = fs.readFileSync('./mock/multiInputTestOutput.csv').toString();

    expect(fileStuff).toBe(fileStuffExpected);
});