/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requestConditions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'nextval("testParts_id_seq"::regclass)'
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
    property: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    operator: {
      type: DataTypes.ENUM('=','!=','<','<=','>','=>'),
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    environmentsId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'requestConditions'
  });
};
