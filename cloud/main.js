// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

AV.Cloud.define("record_desc", function(request, response) {
	var RecordDesc = AV.Object.extend("RecordDesc");
	var descQuery = new AV.Query(RecordDesc);
	descQuery.equalTo("hasSettle", false);
	descQuery.find({
		success: function(results) {
			console.log("record_desc ========= " + results.length);
			console.log("record_desc ========= " + results[0]);
			console.log("record_desc ========= " + results[0].get("payer"));
			response.success(results);
		},
		error: function(error) {
			console.log("record_desc error " + error);
		}
	});
});

AV.Cloud.define("record_result", function(request, response) {
	console.log("record_result in ");
	//request.Object.get("RecordDesc")
	//var RecordDesc = request.param.RecordDesc;
	var RecordDesc = request.object.get("RecordDesc");
	console.log("RecordDesc :  " + RecordDesc);
	var payer = RecordDesc.get('payer');
	var money = RecordDesc.get('money');
	var member = RecordDesc.get('member');
	var objectId = RecordDesc.get('objectId');

	console.log("payer :  " + payer);
	var RecordResult = AV.Object.extend("RecordResult");
	var resultQuery = new AV.Query(RecordResult);
	resultQuery.equalTo("payer", payer);
	console.log("record_result start resultQuery");
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
			console.log("record_result settle");
			response.success(objectId);
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
		success: function(results) {
			console.log("settle_timer record_desc results ------------  " + results.length);
			var length = results.length;
			for (var i = 0; i < length; i++) {
				AV.Cloud.run("record_result", {"RecordDesc":results[i]}, {
					success: function(sub_results) {
						console.log("settle_timer record_result sub_results" + sub_results);
						var objectId = sub_results[0];
						var RecordDesc = new RecordDesc();
						RecordDesc.id = objectId;
						query.equalTo("RecordDesc", RecordDesc);
						query.first({
							success: function(results1) {
								var object = results1[0];
								object.set("hasSettle", "true");
								object.save();
								console.log("has Settle done");
							},
							error: function(error3) {
								console.log("has Settle query fale" + error);
							}
						});
						console.log("settle_timer success " + objectId);
					},
					error: function(error2) {
						console.log("settle_timer error " + error);
					}
				});
			}
		},
		error: function(error1) {
			console.log(error);
		}
	});
});