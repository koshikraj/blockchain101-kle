import bitcoin.rpc
from bitcoin.core import lx

bitcoin.SelectParams('testnet')

proxy_connection = bitcoin.rpc.Proxy(service_url="http://rpc:rpc1234@projects.koshikraj.com:18332")
# tx_id = lx(input())
# print(proxy_connection.gettransaction(tx_id))

# get current height
cur_block_height = proxy_connection.getblockcount()
print("current blockchain height:", cur_block_height)

# get current height
print("genesis block:", proxy_connection.getblock(proxy_connection.getblockhash(1)))
print("last block:", proxy_connection.getblock(proxy_connection.getblockhash(cur_block_height)))
print("last block:", proxy_connection.decoderawtransaction(proxy_connection.getrawtransaction("1d710699c2da92cada058c1df804def5518a99d9e92a016d1a12aa945b051c3e")))
