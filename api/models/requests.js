/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requests', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usersId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parentTestPartId: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    versionsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'versions',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resourceName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    methodName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    httpMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    environmentsId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'requests'
  });
};
