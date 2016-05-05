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

		if (req.param ('withEnvironment', false)) {
			findCriterium.include.push ({
				model: environments,
				as: 'environment'
			});
		}

		if (req.param ('withTests', false)) {
			findCriterium.include.push ({
				model: tests,
				as: 'tests'
			});
		}

		if (req.param ('withVersion', false)) {
			findCriterium.include.push ({model: versions});
		}

		if (req.param ('withAuth', false)) {
			findCriterium.include.push ({model: authentications});
		}

		if (req.param ('withHttpParams', false)) {
			findCriterium.include.push ({model: httpParameters});
		}

		requests.findAll (findCriterium).then (function (data) {
			return res.ok (data);
		}, function (err) {
			return res.serverError (err);
		})

	},

	assertions: function (req, res) {
		requestValidatedByAssertions.findAll ({
			attributes: ['id', 'assertionType', 'property', 'expectedValue', 'comparator'],
			where: {requestsId: req.requestId},
			include: {
				model: assertions,
				attributes: ['name', 'description']
			}
		}).then (function (assertions) {
			return res.ok (assertions);
		}, function (error) {
			return res.serverError (error);
		});
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
					if (!position) position = 0;

					requestsInTest.create ({
						testsId: testsId,
						requestsId: request.id,
						position: parseInt (position) + 1
					}).then (function (assignedTest) {

						request = request.toJSON ();
						request.assignedToTest = assignedTest;

						return res.created (request);
					})
				}, function (error) {
					return res.serverError (error);
				});
			} else {
				return res.created (request)
			}
		}, function (error) {
			return res.serverError (error);
		});
	},

	edit: function (req, res) {
		requests.find ({where: {id: req.requestId}}).then (function (request) {

			if (!request) return res.notFound ();

			request.update ({
				name: req.param ('name'),
				description: req.param ('description'),
				url: req.param ('url'),
				httpMethod: req.param ('httpMethod'),
				versionsId: req.param ('versionsId'),
				authenticationsId: req.param ('authenticationsId')
			}).then (function (edited) {
				return res.ok (edited);
			});

		}, function (error) {
			return res.serverError (error);
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

		if (req.param ('withEnvironment', false)) {
			findCriterium.include.push ({
				model: environments,
				as: 'environment'
			});
		}

		if (req.param ('withTests', false)) {
			findCriterium.include.push ({
				model: tests,
				as: 'tests'
			});
		}

		if (req.param ('withVersion', false)) {
			findCriterium.include.push ({model: versions});
		}

		if (req.param ('withAuth', false)) {
			findCriterium.include.push ({model: authentications});
		}

		if (req.param ('withHttpParams', false)) {
			findCriterium.include.push ({model: httpParameters});
		}

		// toto predelat do service - aby se to dalo pouzit i v runnedTests, resp. pri vkladani do db.
		requests.find (findCriterium).then (function (request) {

			request = request.toJSON ();

			// get query string parameters
			request.queryString = [];
			var parts = request.url.split ('?', 2);
			if (parts.length > 1) {
				var qs = parts[1].split ('&'), parameters;

				for (i in qs) {
					parameters = qs[i].split ('=');
					request.queryString.push ({name: parameters[0], value: parameters[1] || ''})
				}
			}

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

	lastResponse: function (req, res) {
		responses.find ({
			where: {requestsId: req.requestId},
			order: [
				['createdAt', 'DESC']
			]
		}).then (function (response) {
			return res.ok (response);
		});
	},

	delete: function (req, res) {
		requests.findOne ({
			where: {id: req.requestId}
		}).then (function (request) {
			if (!request)
				return res.notFound ();

			request.destroy ();

			return res.ok ('deleted');
		}, function (err) {
			return res.serverError (err);
		});
	}
};

