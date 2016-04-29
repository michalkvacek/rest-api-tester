/**
 * RequestsController
 *
 * @description :: Server-side logic for managing Requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {

		var findCriterium = {
			where: {environmentsId: req.environmentId},
			include: []
		};

		var ignoredTest = req.param ('ignoreTest', false);

		// todo nejak vyresit ignorovany test - potreba pro pridavani requestu do testu
		// idealne nejak jako select * from requests where id not in (select requestsId from requestsInTests where testsId = ignoredTest)
		//   * ale optimalni cestou, idealne nejak pres antijoin, pripadne kombinaci outer joinu a where klauzule

		// if (ignoredTest) {
		// 	findCriterium.include.push ({
		// 		model: tests,
		// 		as: 'tests',
		// 		where: {
		// 			id: {
		// 				$ne: ignoredTest
		// 			}
		// 		}
		// 	});
		// }

		requests.findAll (findCriterium).then (function (data) {
			return res.ok (data);
		}, function (err) {
			return res.serverError (err);
		})

	},

	assign: function (req, res) {
		
	},
	
	create: function (req, res) {

		var testsId = req.param ('testsId', false);

		var parameters = {
			usersId: req.token.id,
			environmentsId: req.environmentId,
			versionsId: req.param ('versionsId', null),
			mockedResponsesId: req.param ('mockedResponsesId', null),
			name: req.param ('name'),
			url: req.param ('url'),
			description: req.param ('description', null),
			httpMethod: req.param ('httpMethod'),
			resourceName: req.param ('resourceName', null),
			methodName: req.param ('methodName', null)
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
						position: parseInt (position) + 1
					}).then (function (assignedTest) {

						request = request.toJSON ();
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
		var findCriterium = {
			where: {
				id: req.requestId
			},
			include: []
		};

		if (req.param ('withAssertions', false)) {
			findCriterium.include.push ({
				model: assertions,
				as: 'assertions'
			});
		}

		requests.find (findCriterium).then (function (request) {

			if (req.param ('withHeaders', false)) {
				headers.findAll ({
					where: {
						$or: [
							{testsId: req.param ('testsId', null)},
							{projectsId: req.projectId},
							{environmentsId: req.environmentId},
							{requestsId: req.requestId}
						]
					}
				}).then (function (headers) {

					request = request.toJSON ();
					request.headers = headers;

					return res.ok (request);
				});
			} else {
				return res.ok (request);
			}
		}, function (err) {
			return res.serverError (err);
		});

	},

};

