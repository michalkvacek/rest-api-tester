/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('testPartsInTest', {
    testsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    testPartsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'testParts',
        key: 'id'
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'testPartsInTest'
  });
};
