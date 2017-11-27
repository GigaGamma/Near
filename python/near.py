# import _thread
import time
import sys
import json
import socket

#assert sys.version_info >= (3,5)

class NearConnection(object):
	def __init__(self, server = "ws://localhost:6194"):
		self.conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		self.conn.connect(("localhost", 1827))
		self._connect()
	def _connect(self):
		self.conn.send(json.dumps({
			"auth": {
				"key": "G_G*1pp"
			},
			"request": {
				"type": "info",
				"vehicle": "test0"	
			}
		}).encode())
		data = self.conn.recv(2048).decode()
		print(json.loads(data)["response"])

def main():
	c = NearConnection()

if __name__ == '__main__':
	main()