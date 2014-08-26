// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});

AV.Cloud.define("settle_timer", function(request, response) {
	AV.Cloud.run('hello', {}, {
		success: function(result) {
			// result is 'Hello world!'
		},
		error: function(error) {}
	});
	return res.success();
});