/**
 * EnvironmentsController
 *
 * @description :: Server-side logic for managing Environments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	/**
	 * List of all environments in given project
	 *
	 * @param res
	 * @param req
	 */
	index: function (req, res) {
		// get all environments assigned to this project

		var findCriterium = {
			where: {projectsId: req.projectId},
			include: []
		};

		// include team members in each environment?
		if (req.param ('withMembers', false)) {
			findCriterium.include.push ({
				model: users,
				as: 'teamMembers',
				where: {id: req.token.id}
			})
		}

		if (req.param ('withTests', false)) {
			findCriterium.include.push ({
				model: tests,
				as: 'tests'
			});
		}

		if (req.param ('withResults', false)) {

		}

		environments.findAll (findCriterium).then (function (environments) {
			return res.json (environments);
		}).catch (function (err) {
			console.error (err);
		});

	},

	/**
	 * Method for obtaining statistics for given environment
	 *
	 * @param req
	 * @param res
	 */
	statistics: function (req, res) {

		// statistical data for last <age> days
		var age = req.param ('age', 7),
			stats = {
				avgResponseTime: 0,
				maxResponseTime: 0,
				avgResponseSize: 0,
				maxResponseSize: 0,
				passed: 0,
				failed: 0
			},
			responseSizeSum = 0,
			responseTimeSum = 0;

		// convert to miliseconds
		age *= 24 * 3600 * 1000;

		responses.findAll ({
			where: {
				createdAt: {
					$gt: new Date (new Date () - age)
				}
			}
		}).then (function (data) {

			stats.testedRequests = data.length;

			for (i in data) {
				if (data.passedAssertions)
					stats.passed++;
				else
					stats.failed++;

				if (data.responseTime > maxResponseTime)
					maxResponseTime = data.responseTime;

				if (data.responseSize > maxResponseSize)
					maxResponseSize = data.responseSize;

				responseSizeSum += data.responseSize;
				responseTimeSum += data.responseTime;
			}

			stats.health = stats.passed > 0 ? (stats.passed + stats.failed) / passed : NaN;
			stats.avgResponseSize = stats.testedRequests > 0 ? responseSizeSum / stats.testedRequests : NaN;
			stats.avgResponseTime = stats.testedRequests > 0 ? responseTimeSum / stats.testedRequests : NaN;

			return res.ok (stats);
		});
	},

	/**
	 * Create new environment in specified project
	 *
	 * @param req
	 * @param res
	 * @returns {*}
	 */
	create: function (req, res) {

		// new environment
		var parameters = {
			usersId: req.token.id,
			projectsId: req.projectId,
			name: req.param ('name'),
			apiEndpoint: req.param ('apiEndpoint'),
			description: req.param ('description')
		};

		// create new environment with data defined above
		environments.create (parameters).then (function (environment) {

			// redirect or send json response with information about successfull creating environment
			return res.created (environment);
		}).catch (function (error) {
			return res.serverError (error);
		})

	}
};

