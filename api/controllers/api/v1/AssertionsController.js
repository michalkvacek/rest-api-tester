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

		requestValidatedByAssertions.find ({
			where: {id: assertionId},
			attributes: ['id', 'assertionType', 'requestsId', 'property', 'expectedValue', 'comparator'],
		}).then (function (assertion) {
			permissionChecker.canManage (req, res, {requestsId: assertion.requestsId}, function () {
				return res.ok (assertion);
			}, function (err) {
				return res.serverError (err);
			});
		});
	},

	/**
	 * Add existing request into test
	 *
	 * @param req
	 * @param res
	 */
	assignToRequest: function (req, res) {

		permissionChecker.canManage (req, res, {
			requestsId: req.requestId,
			roles: ['manager', 'tester']
		}, function () {
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
		});
	},

	/**
	 * Updates existing assertion
	 *
	 * @param req
	 * @param res
	 */
	update: function (req, res) {
		requestValidatedByAssertions.find ({
			where: {id: req.param ('assertionId')},
			attributes: ['id', 'requestsId', 'assertionType', 'property', 'expectedValue', 'comparator']
		}).then (function (validation) {
			permissionChecker.canManage (req, res, {
				requestsId: validation.requestsId,
				roles: ['manager', 'tester']
			}, function () {
				validation.update ({
					property: req.param ('property'),
					comparator: req.param ('comparator'),
					assertionType: req.param ('assertionType'),
					expectedValue: req.param ('expectedValue')
				}).then (function (validation) {
					return res.ok (validation);
				})
			});
		});
	},

	/**
	 * Delete given assertion
	 *
	 * @param req
	 * @param res
	 */
	delete: function (req, res) {
		requestValidatedByAssertions.find ({
			where: {id: req.param ('assertionId')},
			attributes: ['id', 'requestsId']
		}).then (function (validation) {
			permissionChecker.canManage (req, res, {
				requestsId: validation.requestsId,
				roles: ['manager', 'tester']
			}, function () {
				validation.destroy ();

				return res.ok ('deleted');
			});
		});
	}
};

