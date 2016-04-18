/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('evaluatedAsserions', {
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
    requestsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    assertionType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assertionName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assertionProperty: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assertionExpectedValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assertionExtraCode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    recievedValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'evaluatedAsserions'
  });
};
