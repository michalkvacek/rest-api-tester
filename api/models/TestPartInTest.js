/**
 * TestPartInTest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	autoPK: false,
	tableName: "testPartsInTests",
	attributes: {
		testPartsId: {type: 'integer', primaryKey: true},
		testsId: {type: 'integer', primaryKey: true},
		position: {type: 'integer', required: true}
	}
};

