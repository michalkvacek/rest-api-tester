module.exports = {
	addToQueue: function (where, callbackError) {
		var criterium = {
				where: where,
				include: [{
					model: requests,
					as: 'requests',
					include: [
						{model: httpParameters},
						{model: headers}
					]
				},
					{model: headers}
				]
			},
			request = {},
			test = {},
			parameter = {},
			httpParametersList = {},
			requestHeaders = {},
			testHeaders = {},
			environmentHeaders = {};

		tests.find ({where: where, include: [{model: environments}]}).then (function (data) {
			// get headers from environment and project
			headers.findAll ({
				where: {
					$or: {
						environmentsId: data.environmentsId,
						projectsId: data.environment.projectsId
					}
				}
			}).then (function (allHeaders) {

				// make array of headers
				for (i in allHeaders) {
					environmentHeaders[allHeaders[i].name] = allHeaders[i].value;
				}

				tests.findAll (criterium).then (function (envTests) {
					for (i in envTests) {
						test = envTests[i];
						if (test.requests.length == 0)
							continue;

						testHeaders = environmentHeaders;

						for (h in test.headers) {
							testHeaders[test.headers[h].name] = test.headers[h].value;
						}

						runnedTests.create ({
							testName: test.name,
							testDescription: test.description,
							environmentsId: test.environmentsId,
							testsId: test.id,
							status: 'waiting_for_response'
						}).then (function (preparedResult) {
							// insert requests
							for (j in test.requests) {
								request = test.requests[j];
								httpParametersList = {};

								for (k in request.httpParameters) {
									parameter = request.httpParameters[k];
									httpParametersList[parameter.name] = parameter.value;
								}

								requestHeaders = testHeaders;
								for (h in request.headers) {
									requestHeaders[request.headers[h].name] = request.headers[h].value;
								}

								// create placeholder response - will be filled by background workers
								responses.create ({
									environmentsId: preparedResult.environmentsId,
									testsId: preparedResult.testsId,
									runnedTestsId: preparedResult.id,
									requestsId: request.id,
									requestUrl: request.url,
									requestMethod: request.httpMethod,
									requestName: request.name,
									requestHeaders: requestHeaders,
									requestHttpParameters: httpParametersList,
									status: 'waiting_for_response'

								}).then (function (response) {
									testRunner.addJob (response);
								}, callbackError);
							}
						}, callbackError);
					}
				}, callbackError);
			}, callbackError);
		}, callbackError);
	},
	addJob: function (response) {
		var publisher = sails.hooks.publisher;

		//publish send confirmation email
		var job = publisher.create ('evaluate', response.toJSON ()).save ();
	},
};