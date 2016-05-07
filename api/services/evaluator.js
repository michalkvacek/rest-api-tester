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
		var passing = body.length > 0;

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

				console.log(property);
				console.log(body);
				console.log(requestAssertion.property);

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
			element = JSON.parse (body);

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