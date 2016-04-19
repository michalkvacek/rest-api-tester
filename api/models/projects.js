/* jshint indent: 2 */

module.exports = {
	attributes: {
		usersId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id'
			}
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	options: {
		tableName: 'projects',
		hooks: {
			afterCreate: function (project, options) {
				environments.create ({
					usersId: project.usersId,
					projectsId: project.id,
					name: 'Development',
					description: "Development environment created as default environemnt",
					apiEndpoint: "http://example.com"
				}).then (function (environment) {
					// add test and request into environment
					tests.create ({
						name: 'My first test',
						environmentsId: environment.id,
						usersId: project.usersId
					}).then (function (test) {
						requests.create ({
							usersId: project.usersId,
							environmentsId: environment.id,
							url: '/',
							httpMethod: 'GET',
							name: "Example request"
						}).then (function (request) {

							// // [TypeError: val.replace is not a function] 'error@context': {}
							// test.setTestParts([request]).then (function () {
							// 	// done
							// }).catch(function (e) {
							// 	console.log(e);
							// });




							testPartsInTest.create ({
								testPartsId: request.id,
								testsId: test.id,
								position: 1
							}).then (function (testPartInTest) {
								// done
							}).catch (function (err) {
								console.error (err);
							});


						}).catch (function (err) {
							console.error (err);
						});
					}).catch (function (err) {
						console.error (err);
					});
				}).catch (function (err) {
					console.error (err);
				});
			}
		}
	},
	// create relationships with other models
	associations: function () {

		/**
		 * User who created project
		 */
		projects.belongsTo (users, {
			foreignKey: {
				name: 'usersId',
				as: 'author',
				allowNull: false
			}
		});

		/**
		 * Users, who manages this environment
		 */
		projects.hasMany (environments, {
			foreignKey: {
				name: 'projectsId',
				allowNull: false
			}
		});
	}
};


