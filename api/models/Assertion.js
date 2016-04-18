/**
 * Assertion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'assertions',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: true,
	attributes: {
		type: {
			type: "string",
			maxLength: 64,
			unique: true,
			required: true
		},
		name: {
			type: "string",
			maxLength: 126,
			required: true
		},
		description: {
			type: "string"
		},
		extraCode: {
			type: "string"
		}
	}
}
;

