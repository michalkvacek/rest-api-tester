/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requestValidatedByAssertions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    requestsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id'
      }
    },
    assertionsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assertions',
        key: 'id'
      }
    },
    property: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expectedValue: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'requestValidatedByAssertions'
  });
};
