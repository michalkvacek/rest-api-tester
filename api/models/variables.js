/* jshint indent: 2 */

module.exports = {attributes:  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usersId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    testsId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'tests',
        key: 'id'
      }
    },
    requestsId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    property: {
      type: Sequelize.STRING,
      allowNull: true
    },
    defaultValue: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, 
    tableName: 'variables'
};
