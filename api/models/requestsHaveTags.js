/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requestsHaveTags', {
    id_tags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_requests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id'
      }
    }
  }, {
    tableName: 'requestsHaveTags'
  });
};
