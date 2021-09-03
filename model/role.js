const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Role = sequelize.define('role',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  name:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  code:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  weight:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (role,options){
        role.isActive = true;
        role.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(Role);
sequelizePaginate.paginate(Role);
module.exports = Role;
