import { ConfigInterface } from "./Curate";

//treat the filenames like you are in the ROOT of the project.
const config: ConfigInterface = {
    "inputFilenames": [
        "./temp/nhgis0063_ds244_20195_county.csv"
    ],
    "outputFile": "./out/out_internet_access.csv",
    "joinField": "GISJOIN",
    "outputFields": {
        "GISJOIN": {
            "type": "copy",
            "input": "GISJOIN"
        },
        "with_an_internet_subscription_per_1000": {
            "label": "Number of Households With an Internet Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL1YE002",
                "@@DIVIDE",
                "AL1YE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "no_internet_per_1000": {
            "label": "Number of Households With No Internet Access per 1000 Households",
            "type": "math",
            "input": [
                "AL1YE013",
                "@@DIVIDE",
                "AL1YE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "number_of_households": {
            "label": "Number of Households",
            "type": "copy",
            "input": "AL1YE001"
        }
    }
}

export default config;