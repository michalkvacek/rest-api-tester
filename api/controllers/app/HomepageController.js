/**
 * App/HomepageController
 *
 * @description :: Server-side logic for managing app/homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * Homepage for whole app
	 * 
	 * @param req
	 * @param res
	 */
	index: function (req, res) {
		return res.view('homepage');
	}
};

