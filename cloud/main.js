// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

AV.Cloud.define("record_desc", function(request, response) {
	var RecordDesc = AV.Object.extend("RecordDesc");
	var descQuery = new AV.Query(RecordDesc);
	descQuery.equalTo("hasSettle", "false");
	descQuery.find({
		success: function(results) {
			var length = results.length;
			var RecordDescs = new Array(length);
			for (var i = 0; i < length; i++) {
				var object = results[i];
				var payer = object.get('payer');
				var money = object.get('money');
				var member = object.get('member');
				RecordDescs[i] = new Array(3);
				RecordDescs[i][0] = payer;
				RecordDescs[i][1] = money;
				RecordDescs[i][2] = member;
			}
			return RecordDescs;
		},
		error: function(error) {
			console.log("record_desc error " + error);
		}
	});
});

AV.Cloud.define("record_result", function(request, response) {
	var RecordDescs = request.object.get("RecordDescs");
	var payer = RecordDescs[0];
	var money = RecordDescs[1];
	var member = RecordDescs[2];

	var RecordResult = AV.Object.extend("RecordResult");
	var resultQuery = new AV.Query(RecordResult);
	resultQuery.equalTo("payer", payer);
	resultQuery.find({
		success: function(results) {
			var object = results[0];
			var memberNumber = member.length;
			var average = money / memberNumber;
			for (var i = 0; i < memberNumber; i++) {
				if (member[i] != payer) {
					var original = object.get(member[i]);
					object.set(member[i], original + average);
				}
			};
			object.save();
			response.success();
		},
		error: function(error) {
			console.log("record_result error " + error);
		}
	});
});

AV.Cloud.define("push", function(request, response) {
	response.success("Push!");
});

AV.Cloud.define("settle_timer", function(request, response) {
	AV.Cloud.run('record_desc', {}, {
		success: function(result) {
			var length = results.length;
			for (var i = 0; i < length; i++) {
				AV.Cloud.run("record_result", {
					RecordDescs: results[i]
				}, {
					success: function(result) {
						console.log("settle_timer success " + result);
					},
					error: function(error) {
						console.log("settle_timer error " + error);
					}
				});
			}
		},
		error: function(error) {
			console.log(error);
		}
	});
});