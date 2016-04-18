/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assertions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    extraCode: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'assertions'
  });
};
