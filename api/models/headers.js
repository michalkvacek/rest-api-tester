/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('headers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    projectsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    environmentsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'environments',
        key: 'id'
      }
    },
    testsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tests',
        key: 'id'
      }
    },
    requestsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'requests',
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
    tableName: 'headers'
  });
};
