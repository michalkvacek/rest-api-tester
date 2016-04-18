/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tests', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    environmentsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'environments',
        key: 'id'
      }
    },
    usersId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'now()'
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
    nextRun: {
      type: DataTypes.DATE,
      allowNull: true
    },
    runInterval: {
      type: 'TINTERVAL',
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    tableName: 'tests'
  });
};
