const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let RouteRole = sequelize.define('routeRole',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  routeId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  roleId:{ type:DataTypes.INTEGER },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (routeRole,options){
        routeRole.isActive = true;
        routeRole.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(RouteRole);
sequelizePaginate.paginate(RouteRole);
module.exports = RouteRole;
