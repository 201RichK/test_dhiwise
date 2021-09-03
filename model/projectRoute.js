const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let ProjectRoute = sequelize.define('projectRoute',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  route_name:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  method:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  uri:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (projectRoute,options){
        projectRoute.isActive = true;
        projectRoute.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(ProjectRoute);
sequelizePaginate.paginate(ProjectRoute);
module.exports = ProjectRoute;
