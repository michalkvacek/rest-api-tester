/* jshint indent: 2 */

module.exports = {attributes:  {
    testsId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    testPartsId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'testParts',
        key: 'id'
      }
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, 
    tableName: 'testPartsInTest'
};
