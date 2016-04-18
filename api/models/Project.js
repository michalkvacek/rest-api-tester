/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	autoPK: true,
	tableName: "projects",
	attributes: {
		name: {type: 'string', required: true},
		// usersId: {type: "integer", required: true},
		description: {type: 'string'},
		usersId: {
			model: "User",
			foreignKey: true,
			on: "id",
			via: "usersId"
		},
		environments: {
			collection: "Environment",
			tableName: "environments",
			via: 'projectsId',
			on: "id"
		}
	},

	getAllUsersProjects: function (user, callback) {

		if (typeof  callback != "function")
			throw new Error ('Callback not a function');

		Project.find ({usersId: user.id}).populate ('environments').exec (function (err, projects) {
			if (err) {
				console.error(err);
				return callback (err, null);
			}

			return callback (null, projects);
		});
	},
	afterCreate: function (project, callback) {
		Environment.create ({
			usersId: project.usersId,
			projectsId: project.id,
			name: 'Development',
			description: "Development environment created as default environemnt",
			apiEndpoint: "http://example.com"
		}).then (function (environment) {
			// add test and request into environment
			Test.create ({
				name: 'My first test',
				environmentsId: environment.id,
				usersId: project.usersId
			}).then (function (test) {
			// 	Request.create ({
			// 		usersId: project.usersId,
			// 		environmentsId: environment.id,
			// 		url: '/',
			// 		httpMethod: 'GET',
			// 		name: "Example request"
			// 	}).then (function (request) {
			// 		TestPartInTest.create ({
			// 			testPartsId: request.id,
			// 			testsId: test.id,
			// 			position: 1
			// 		}).then (function (testPartInTest) {
			// 			return callback ();
			// 		}).catch (function (err) {
			// 			console.error (err);
			// 			return callback (err)
			// 		});
			// 	}).catch (function (err) {
			// 		console.error (err);
			// 		return callback (err)
			// 	});
			}).catch (function (err) {
				console.error (err);
				return callback (err)
			});
		}).catch (function (err) {
			console.error (err);
			return callback (err)
		});
	}
};

