module.exports = {

	/**
	 * Evaluate given assertion
	 *
	 * @param assert
	 * @param request
	 * @param response
	 * @param body
	 * @param responseTime
	 * @returns {*}
	 */
	evaluate: function (assert, request, response, body, responseTime) {
		var recievedValue = {}, status,
			expectedValue = assert.requestValidatedByAssertions.expectedValue;
		switch (assert.type) {
			case 'status_code':
				recievedValue = response.statusCode;
				status = evaluator.compare (expectedValue, '==', response.statusCode);
				break;
			case 'response_time':
				recievedValue = responseTime;
				status = evaluator.compare(expectedValue, '>=', responseTime);
				break;
		}

		// create new entry in database
		evaluatedAssertions.create ({
			responsesId: request.id,
			assertionType: assert.type,
			assertionName: assert.name,
			assertionProperty: assert.requestValidatedByAssertions.property,
			assertionExpectedValue: expectedValue,
			recievedValue: recievedValue,
			passed: status
		}).then (function (evaluated) {
		});

		return status;
	},
	compare: function (expectedValue, operator, recievedValue) {

		switch (operator) {
			case '==':
				return expectedValue == recievedValue;
				break;
			case '>=':
				return expectedValue >= recievedValue;
				break;
			case '<=':
				return expectedValue <= recievedValue;
				break;
			case '!=':
				return expectedValue != recievedValue;
				break;
			case '>':
				return expectedValue > recievedValue;
				break;
			case '<':
				return expectedValue < recievedValue;
				break;
			case 'in':
				return false;
				break;

		}


		return expectedValue == recievedValue;
	}
};