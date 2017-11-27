var net = require("net");
var request = require("./request.js");
//var db = require("./db.js");
var sqlite = require("sqlite3");

var db = new sqlite.Database("api.db");

db.serialize(function () {

	db.each("SELECT * FROM tokens", function (err, row) {
		request.keys.push(row.val);
	});

});

function isValidJson(str) {
	try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

net.createServer(function (socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	console.log("Connection: " + socket.name);
	socket.on("data", function (data) {
		if (isValidJson(data)) {
			var json = JSON.parse(data);
			if (json.auth != null && json.auth.key != null && request.auth(json.auth.key)) {
				var rt = request.type(json);
				if (rt == "info") {
					socket.write(JSON.stringify({
						"response": {
							"name": "vehicle0",
							"ip": "123.456.789",
							"ips": [
								"otherip",
								"otherip2"
							]
						}
					}));
				} else if (rt == "update") {
					socket.write(JSON.stringify({
						"response": true
					}));
					
					console.log("Vehicle Id: " + json.payload.vehicle);
					console.log("Latitude: " + json.payload.lat);
					console.log("Longitude: " + json.payload.long);
				} else {
					socket.write(JSON.stringify({
						"response": "Request type unknown"
					}));
				}
			} else {
				socket.write(JSON.stringify({
					"response": "Please authenticate yourself"
				}));
			}
		}
	});

	socket.on("end", function (data) {
		console.log(socket.name + " has disconnected");
	});
}).listen(1827);

console.log("Ears are ready!");