var keys = [];

module.exports = {
	auth: function (key) {
		return keys.indexOf(key) != -1;
	},
	type: function (json) {
		if (json.auth != null && json.auth.key != null) {
			return json.request.type;
		} else {
			return "_";
		}
	},
	keys: keys
}