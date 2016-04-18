/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('response', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    requestUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requestQueryString: {
      type: DataTypes.JSON,
      allowNull: true
    },
    requestHttpParameters: {
      type: DataTypes.JSON,
      allowNull: true
    },
    responseTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reponseCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    responseSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    responseBodyJson: {
      type: DataTypes.JSON,
      allowNull: true
    },
    responseBodyXml: {
      type: 'XML',
      allowNull: true
    },
    responseBodyRaw: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    passedAssertions: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('waiting_for_response','evaluating','failed','success'),
      allowNull: false
    }
  }, {
    tableName: 'response'
  });
};
