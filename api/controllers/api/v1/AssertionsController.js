/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	types: function (req, res) {
		assertions.findAll ().then (function (asserts) {
			return res.ok (asserts);
		}, function (err) {
			return res.serverError (err);
		});
	},

	detail: function (req, res) {
		var assertionId = req.param ('assertionId');

		requestValidatedByAssertions.find ({where: {id: assertionId}}).then (function (assertion) {
			return res.ok (assertion);
		}, function (err) {
			return res.serverError (err);
		});
	},

	assignToRequest: function (req, res) {

		requestValidatedByAssertions.create ({
			requestsId: req.requestId,
			assertionType: req.param ('assertionType'),
			comparator: req.param ('comparator'),
			property: req.param ('property', null),
			expectedValue: req.param ('expectedValue')
		}).then (function (validation) {
			return res.created (validation);
		}, function (error) {
			return res.serverError (error);
		});
	},

	update: function (req, res) {
		requestValidatedByAssertions.find ({
			where: {id: req.param ('assertionId')}
		}).then (function (validation) {
			validation.update ({
				property: req.param ('property'),
				comparator: req.param ('comparator'),
				assertionType: req.param ('assertionType'),
				expectedValue: req.param ('expectedValue')
			}).then (function (validation) {
				return res.ok (validation);
			})
		})
	},

	delete: function (req, res) {
		requestValidatedByAssertions.find ({
			where: {
				id: req.param ('assertionId')
			}
		}).then (function (validation) {
			validation.destroy ();

			return res.ok ('deleted');
		})
	},
};

