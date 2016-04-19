/* jshint indent: 2 */

module.exports = {
	attributes: {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	options: {
		tableName: 'users',
		classMethods: {
			getManagedProjects: function (user, callback) {
				if (typeof  callback != "function")
					throw new Error ('Callback not a function');

				callback(null, []);

			},
			getOwnProjects: function (user, callback) {

				if (typeof  callback != "function")
					throw new Error ('Callback not a function');

				// get projects model
				var proj = sequelize.model ('projects');

				// some warning is emitted here.. I don't know why..
				// Warning: a promise was created in a handler but was not returned from it
				// http://www.redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html
				projects.findAll ({include: [environments]}).then (function (data) {
					return callback (null, data);
				}).catch (function (err) {
					console.error (err);
					return callback (err, null);
				});
			}
		}
	},
	associations: function () {
		users.hasMany (environments, {
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});

		users.belongsToMany (environments, {
			through: userBelongsToEnvironment,
			as: 'team',
			foreignKey: {
				name: 'usersId',
				allowNull: false
			}
		});
	},
};
