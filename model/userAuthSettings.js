const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let UserAuthSettings = sequelize.define('userAuthSettings',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  userId:{ type:DataTypes.INTEGER },
  loginOTP:{ type:DataTypes.TEXT },
  expiredTimeOfLoginOTP:{ type:DataTypes.DATE },
  resetPasswordCode:{ type:DataTypes.TEXT },
  expiredTimeOfResetPasswordCode:{ type:DataTypes.DATE },
  loginRetryLimit:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  loginReactiveTime:{ type:DataTypes.DATE },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (userAuthSettings,options){
        userAuthSettings.isActive = true;
        userAuthSettings.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(UserAuthSettings);
sequelizePaginate.paginate(UserAuthSettings);
module.exports = UserAuthSettings;
