var HttpRequest = require ('request');

module.exports = {
	//specify worker
	//job concurrency
	concurrency: 2,

	perform: function (job, context, done) {

		var request = job.data,
			runStart = {};

		requests.find ({
			where: {id: request.requestsId},
			include: [{model: authentications}]
		}).then (function (originalRequest) {

			// mark test as running
			runnedTests.find ({where: {testsId: request.testsId, status: 'waiting_for_response'}}).then (function (test) {
				if (test == null)
					return;

				test.update ({status: 'evaluating'}).then (function () {
				});
			});

			responses.find ({where: {id: request.id}}).then (function (preparedResponse) {

				// mark response as running/evaluating
				preparedResponse.update ({status: 'evaluating'}).then (function () {
				});

				runStart = Date.now ();

				// todo pridat podporu autentifikace

				HttpRequest ({
					url: request.requestUrl,
					method: request.requestMethod,
					headers: request.requestHeaders,
					// body: request.requestHttpParameters
				}, function (error, response, body) {
					var responseTime = Date.now () - runStart;

					// ignore errors
					if (error) {
						response = {};
						body = '';
					}

					evaluator.parseRequestResponse (originalRequest, request, preparedResponse, error, response, body, responseTime, done);
				});
			});
		});
	}
};