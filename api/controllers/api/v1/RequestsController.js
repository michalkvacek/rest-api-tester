/**
 * RequestsController
 *
 * @description :: Server-side logic for managing Requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		var environmentId = req.param ('environmentId');

	},

	create: function (req, res) {

		var testsId = req.param ('testsId', false);

		var parameters = {
			usersId: req.token.id,
			environmentsId: req.environmentId,
			versionsId: req.param ('versionsId', null),
			mockedResponsesId: req.param ('mockedResponsesId', null),
			name: req.param ('name'),
			description: req.param ('description', null),
			httpMethod: req.param ('httpMethod'),
			resourceName: req.param ('resourceName', null),
			methodName: req.param ('methodName', null),
			url: req.param ('url', null)
		};

		requests.create (parameters).then (function (request) {
			if (testsId) {
				// select last sequence
				requestsInTest.max ('position', {
					where: {
						testsId: testsId
					}
				}).then (function (position) {
					requestsInTest.create ({
						testsId: testsId,
						requestsId: request.id,
						position: parseInt(position) + 1
					}).then (function (assignedTest) {

						request.assignedToTest = assignedTest;

						return res.created (request)
					})
				});
			} else {
				return res.created (request)
			}
		})

	},

	detail: function (req, res) {
		var testId = req.param ('testId');
	},

};

