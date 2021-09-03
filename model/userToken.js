const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let UserToken = sequelize.define('userToken',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  userId:{ type:DataTypes.INTEGER },
  token:{ type:DataTypes.TEXT },
  tokenExpiredTime:{ type:DataTypes.DATE },
  isTokenExpired:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (userToken,options){
        userToken.isActive = true;
        userToken.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(UserToken);
sequelizePaginate.paginate(UserToken);
module.exports = UserToken;
