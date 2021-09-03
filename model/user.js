const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
const bcrypt = require('bcrypt');
let User = sequelize.define('user',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  username:{ type:STRING },
  password:{ type:STRING },
  email:{ type:DataTypes.TEXT },
  name:{ type:STRING },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DATE },
  updatedAt:{ type:DATE },
  addedBy:{ type:INTEGER },
  updatedBy:{ type:INTEGER },
  isDeleted:{ type:DataTypes.BOOLEAN },
  role:{ type:DataTypes.INTEGER }
}
,{
  hooks:{
    beforeCreate: [
      async function (user,options){
        if (user.password){ user.password =
          await bcrypt.hash(user.password, 8);}
        user.isActive = true;
        user.isDeleted = false;
      },
    ],
    afterCreate: [
      async function (user,options){
        sequelize.model('userAuthSettings').create({ userId:user.id });
      },
    ],
  }
}
);
User.prototype.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

sequelizeTransforms(User);
sequelizePaginate.paginate(User);
module.exports = User;
