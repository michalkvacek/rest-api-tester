/**
 * Connections
 * (sails.config.connections)
 *
 * This config contains connection only to PostgreSQL via SEQUELIZE
 *
 * Sequelize was used as described in article by at http://munkacsy.me/use-sequelize-with-sails-js/
 */

module.exports.connections = {
	postgreSQL: {
		// user: sails.config.local.user,
		// password: sails.config.local.password,
		// database: sails.config.local.database,
		options: {
			// host: sails.config.local.host,
			dialect: 'postgres',
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		}
	}
};
