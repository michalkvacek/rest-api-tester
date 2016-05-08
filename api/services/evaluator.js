module.exports = {
	/**
	 * Method called from background job for evaluating request
	 *
	 * @param originalRequest
	 * @param request
	 * @param preparedResponse
	 * @param error
	 * @param response
	 * @param body
	 * @param responseTime
	 * @param done
	 */
	parseRequestResponse: function (originalRequest, request, preparedResponse, error, response, body, responseTime, done) {
		// body is empty on error
		var passing = Object.keys (response).length > 0;

		// assign assertsions
		requestValidatedByAssertions.findAll ({
			attributes: ['id', 'assertionType', 'property', 'expectedValue', 'comparator'],
			where: {requestsId: originalRequest.id},
			include: [{model: assertions}]
		}).then (function (assertions) {

			// evaluate all assertions
			for (i in assertions) {
				if (!evaluator.evaluate (assertions[i], request, response, body, responseTime))
					passing = false;
			}

			if (typeof body == 'object')
				body = JSON.stringify (body);

			// and save the result into database
			preparedResponse.update ({
				responseHeaders: response.headers,
				responseCode: response.statusCode,
				responseSize: body.length,
				responseTime: responseTime,
				responseBodyRaw: body,
				passedAssertions: passing,
				status: passing ? 'success' : 'failed'
			}).then (function (evaluated) {
				originalRequest.update ({lastRunStatus: evaluated.status}).then (function (original) {
					done (null, {request: evaluated.toJSON ()});
				});
			});
		});
	},

	getRequestOptions: function (auth, request, envelope, callback) {
		var options = {
			url: request.requestUrl,
			method: request.requestMethod,
			headers: request.requestHeaders,
			json: true
		};

		if (request.requestMethod != 'GET') {
			var data = {};
			if (envelope != null)
				data[envelope] = request.requestHttpParameters;
			else
				data = request.requestHttpParameters;

			options.form = data;
		}

		if (auth) {
			switch (auth.type) {
				case 'bearer':
					options.auth = {'bearer': auth.token};

					// append to url
					if (auth.tokenParameter) {
						options.url += options.url.indexOf ('?') == -1 ? '?' : '&';
						options.url += auth.tokenParameter + "=" + auth.token
					}
					break;

				case 'base':
					options.auth = {
						user: auth.username,
						pass: auth.password
					};
					break;
			}
		}

		return callback(options);
	},

	/**
	 * Evaluate given assertion
	 *
	 * @param assert
	 *
	 * @param request
	 * @param response
	 * @param body
	 * @param responseTime
	 * @returns {*}
	 */
	evaluate: function (assert, request, response, body, responseTime) {
		var recievedValue = {}, status,
			expectedValue = assert.expectedValue,
			property = assert.property,
			comparator = assert.comparator;

		recievedValue = evaluator.getRecievedValue (assert, request, response, body, responseTime);

		// compare data
		status = evaluator.compare (expectedValue, comparator, recievedValue);

		// create new entry in database
		evaluatedAssertions.create ({
			responsesId: request.id,
			assertionType: assert.assertionType,
			assertionName: assert.assertion.name,
			assertionProperty: assert.property,
			assertionExpectedValue: expectedValue,
			assertionComparator: comparator,
			recievedValue: recievedValue,
			passed: status
		}).then (function (evaluated) {
		});

		console.log(request.id+" evaluated: "+status);

		return status;
	},

	/**
	 * Returns wanted value based on assertion type
	 *
	 * @param requestAssertion
	 * @param request
	 * @param response
	 * @param body
	 * @param responseTime
	 * @returns {*}
	 */
	getRecievedValue: function (requestAssertion, request, response, body, responseTime) {
		switch (requestAssertion.assertionType) {
			case 'status_code':
				return response.statusCode;
				break;

			case 'response_time':
				return responseTime;
				break;
			case 'count':

				var property = evaluator.getProperty (body, requestAssertion.property);
				if (typeof property == 'undefined' || property == null || !property)
					return 0;

				return Object.keys (property).length;
				break;

			case 'property_exists':
				return evaluator.getProperty (body, requestAssertion.property) != false;
				break;
			case 'property_value':
				return evaluator.getProperty (body, requestAssertion.property);
				break;

			case 'json':
				var content = evaluator.getProperty (body, requestAssertion.property);
				return JSON.stringify (content);
				break;

		}
	},

	/**
	 * Get property value
	 *
	 * This method parses recieved body and returns given property.
	 *
	 * @param body
	 * @param property
	 * @returns {*}
	 */
	getProperty: function (body, property) {

		// because of some kind of weird optimalization reasons

		var route, element, i;
		if (property != null)
			route = property.split ('.').reverse ();

		try {
			element = (typeof body == 'object') ? body : JSON.parse (body);

			// user wants root element
			if (property == null)
				return element;

			i = route.length;

			while (i--) {
				if (element[route[i]] !== undefined) {
					if (i == 0) {
						return element[route[i]];
					}
					element = element[route[i]];
				} else {
					return false;
				}
			}
		} catch (e) {
			return null;
		}
	},

	/**
	 * Universal method for comparing recieved and expected value
	 *
	 * @param expectedValue
	 * @param operator
	 * @param recievedValue
	 * @returns {boolean}
	 */
	compare: function (expectedValue, operator, recievedValue) {
		switch (operator) {
			case 'eq':
				return "" + expectedValue == "" + recievedValue;
				break;
			case 'ge':
				return expectedValue <= recievedValue;
				break;
			case 'le':
				return expectedValue >= recievedValue;
				break;
			case 'ne':
				return expectedValue != recievedValue;
				break;
			case 'gt':
				return expectedValue < recievedValue;
				break;
			case 'lt':
				return expectedValue > recievedValue;
				break;
			case 'in':
				return recievedValue.indexOf (expectedValue) >= 0;
				break;
			case 'not_in':
				return recievedValue.indexOf (expectedValue) < 0;
				break;

		}

		return expectedValue == recievedValue;
	}
};