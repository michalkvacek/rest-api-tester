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
		user: 'postgres',
		password: 'sql',
		database: 'test_rest_api',
		options: {
			host: 'localhost',
			dialect: 'postgres',
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		}
	}
};
