// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

AV.Cloud.define("query", function(request, response) {
	var RecordDesc = AV.Object.extend("RecordDesc");
	var query = new AV.Query(RecordDesc);
	query.equalTo("hasSettle", "false");
	query.find({
		success: function(results) {
			var length = results.length;
			var RecordDescs = new Array(length);
			for (var i = 0; i < length; i++) {
				var object = results[i];
				var member = object.get('member');
				var money = object.get('money');
				var payer = object.get('payer');
				RecordDescs[i] = new Array(3);
				RecordDescs[i][0] = payer;
				RecordDescs[i][1] = money;
				RecordDescs[i][2] = member;
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
});

AV.Cloud.define("settle_timer", function(request, response) {
	AV.Cloud.run('hello', {}, {
		success: function(result) {
			// result is 'Hello world!'
		},
		error: function(error) {}
	});
});