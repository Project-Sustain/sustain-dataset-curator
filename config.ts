const config = {
    "inputFilenames": [
        "./temp/nhgis0056_ds244_20195_2019_tract.csv"
    ],
    "outputFile": "./out/out.csv",
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
                "AL2FE002",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "with_dialup_per_1000": {
            "label": "Number of Households With only a Dial-Up Internet Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE003",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "with_broadband_per_1000": {
            "label": "Number of Households With a Broadband Internet Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE004",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "with_satellite_per_1000": {
            "label": "Number of Households With a Satellite Internet Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE005",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "with_other_per_1000": {
            "label": "Number of Households Some Other Type of Internet Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE006",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "access_no_subscription_per_1000": {
            "label": "Number of Households With Internet Access, but no Subscription per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE007",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "no_internet_per_1000": {
            "label": "Number of Households With No Internet Access per 1000 Households",
            "type": "math",
            "input": [
                "AL2FE008",
                "@@DIVIDE",
                "AL2FE001",
                "@@TIMES",
                1000
            ],
            "toInt": "FLOOR"
        },
        "number_of_households": {
            "label": "Number of Households",
            "type": "copy",
            "input": "AL2FE001"
        }
    }
}

export default config;