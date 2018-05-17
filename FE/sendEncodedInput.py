from web3 import Web3, HTTPProvider, IPCProvider, WebsocketProvider
import sys
from encode import generateBytes


web3 = Web3(HTTPProvider('https://kovan.decenter.com'))

command  = sys.argv[1]

if command == "gen":
    val = sys.argv[2]
    generateBytes(int(val))


def testEt():
    block = web3.eth.getBlock('latest')
    print (block.hash)
    print (block.number)


