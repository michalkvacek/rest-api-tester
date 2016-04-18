/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requestHeaders', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    responsesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'response',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'requestHeaders'
  });
};
