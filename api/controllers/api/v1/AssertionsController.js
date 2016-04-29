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
		});
	},

	assignToRequest: function (req, res) {

		requestValidatedByAssertions.create ({
			requestsId: req.param ('requestsId'),
			assertionsId: req.param ('assertionsId'),
			property: req.param ('property, null'),
			exectedValue: req.param ('expectedValue', null)
		}).then (function (validation) {
			return res.created (validation);
		}, function (error) {
			return res.serverError (error);
		});
	},

	editAssignedAssertions: function (req, res) {
		requestValidatedByAssertion.find ({
			where: {
				id: req.param ('validationId'),
				assertionsId: req.param ('assertionsId')
			}
		}).then (function (validation) {
			validation.update ({
				property: req.param ('property'),
				assertionsId: req.param ('assertionsId'),
				expectedValue: req.param ('expectedValue')
			}).then (function (validation) {
				return res.ok (validation);
			})
		})
	},

	deleteAssignedAssertion: function (req, res) {
		requestValidatedByAssertion.find ({
			where: {
				requestsId: req.param ('requestsId'),
				assertionsId: req.param ('assertionsId')
			}
		}).then (function (validation) {
			validation.destroy ();

			return res.ok ('deleted');
		})
	},
};

