/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('variables', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usersId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    testsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tests',
        key: 'id'
      }
    },
    requestsId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    property: {
      type: DataTypes.STRING,
      allowNull: true
    },
    defaultValue: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'variables'
  });
};
