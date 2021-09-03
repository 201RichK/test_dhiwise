const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let UserRole = sequelize.define('userRole',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  roleId:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (userRole,options){
        userRole.isActive = true;
        userRole.isDeleted = false;
      },
    ],
  }
}
);

sequelizeTransforms(UserRole);
sequelizePaginate.paginate(UserRole);
module.exports = UserRole;
