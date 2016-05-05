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
			expectedValue = assert.requestValidatedByAssertions.expectedValue,
			property = assert.requestValidatedByAssertions.property,
			comparator = assert.requestValidatedByAssertions.comparator;

		recievedValue = evaluator.getRecievedValue (assert.requestValidatedByAssertions, request, response, body, responseTime);

		// switch (assert.type) {
		// 	case 'status_code':
		// 		recievedValue = response.statusCode;
		// 		status = evaluator.compare (expectedValue, '==', response.statusCode);
		// 		break;
		// 	case 'response_time':
		// 		recievedValue = responseTime;
		// 		status = evaluator.compare (expectedValue, '>=', responseTime);
		// 		break;
		// }
		//
		// if (assert.type == 'property_exists') {
		// 	comparator = '=';
		// 	expectedValue = true;
		// }

		// compare data
		status = evaluator.compare (expectedValue, comparator, recievedValue);

		// create new entry in database
		evaluatedAssertions.create ({
			responsesId: request.id,
			assertionType: assert.type,
			assertionName: assert.name,
			assertionProperty: assert.requestValidatedByAssertions.property,
			assertionExpectedValue: expectedValue,
			assertionComparator: comparator,
			recievedValue: recievedValue,
			passed: status
		}).then (function (evaluated) {
		});

		return status;
	},

	getRecievedValue: function (requestAssertion, request, response, body, responseTime) {
		switch (requestAssertion.assertionType) {
			case 'status_code':
				return response.statusCode;
				break;

			case 'response_time':
				return responseTime;
				break;

			case 'property_exists':
				return evaluator.getProperty (body, requestAssertion.property) != false;
				break;
			case 'property_value':
				return evaluator.getProperty (body, requestAssertion.property);
				break;

			case 'body':
				return body;
				break;

		}
	},

	getProperty: function (body, property) {
		var elements = property.split ('.');

		try {
			var element = JSON.parse (body);

			for (i in elements) {
				if (!element.hasOwnProperty (elements[i])) return false;
				element = element[i];
			}

			return element;
		} catch (e) {
			// invalid json
			return false;
		}
	},

	compare: function (expectedValue, operator, recievedValue) {

		switch (operator) {
			case 'eq':
				return ""+expectedValue == ""+recievedValue;
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
				return recievedValue.indexOf(expectedValue) >= 0;
				break;
			case 'not_in':
				return recievedValue.indexOf(expectedValue) < 0;
				break;

		}

		return expectedValue == recievedValue;
	}
};