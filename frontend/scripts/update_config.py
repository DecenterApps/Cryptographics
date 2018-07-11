import os
import json


"""
==============
This script is going to fill config.json file with addresses and abi's from last build. 
This means whenever you do "truffle migrate", you need to run this script and update config file.
==============

==============
To run: $ python update_config.py
==============

"""
directory = "../../build/contracts"
dict = {}
abi = {}
for contract in os.listdir(directory):
    if contract.endswith(".json"):
        with open(os.path.join(directory,contract)) as json_contract:
            dictdump = json.loads(json_contract.read())
            if(dictdump["abi"] != None):
                abi[contract] = dictdump["abi"]
            if(dictdump["networks"].get("42") != None ):
                #print (contract,dictdump["networks"]["4447"]["address"])
                dict[contract] = dictdump["networks"]["42"]["address"]



for key in dict:
    print(key, dict[key])

with open("config.json","r+") as jsonFile:
    data = json.load(jsonFile)

#    functions = data["functionsContract"]
    assetManager = data["assetManagerContract"]
    digitalPrintImage = data["digitalPrintImageContract"]


 #   data["functionsContract"]["abi"] = abi["Functions.json"]
  #  data["functionsContract"]["networks"]["42"]["address"] = dict["Functions.json"]


    data["assetManagerContract"]["abi"] = abi["AssetManager.json"]
    data["assetManagerContract"]["networks"]["42"]["address"] = dict["AssetManager.json"]

    data["digitalPrintImageContract"]["abi"] = abi["DigitalPrintImage.json"]
    data["digitalPrintImageContract"]["networks"]["42"]["address"] = dict["DigitalPrintImage.json"]




    jsonFile.seek(0)
    json.dump(data, jsonFile)
    jsonFile.truncate()
