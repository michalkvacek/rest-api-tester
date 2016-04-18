/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('testParts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usersId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    parentTestPartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'testParts',
        key: 'id'
      }
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
    environmentsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'environments',
        key: 'id'
      }
    }
  }, {
    tableName: 'testParts'
  });
};
