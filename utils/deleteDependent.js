let User = require('../model/user');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('../utils/dbService');
const { Op } = require('sequelize');

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user?.length){
      user = user.map((obj) => obj.id);
      const userFilter5389 = { 'addedBy': { [Op.in]: user } };
      const user2048 = await deleteUser(userFilter5389);
      const userFilter0719 = { 'updatedBy': { [Op.in]: user } };
      const user4620 = await deleteUser(userFilter0719);
      const userAuthSettingsFilter1447 = { 'userId': { [Op.in]: user } };
      const userAuthSettings8929 = await deleteUserAuthSettings(userAuthSettingsFilter1447);
      const userTokenFilter7489 = { 'userId': { [Op.in]: user } };
      const userToken4033 = await deleteUserToken(userTokenFilter7489);
      const userRoleFilter4382 = { 'userId': { [Op.in]: user } };
      const userRole2912 = await deleteUserRole(userRoleFilter4382);
      return await User.destroy({ where :filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    return await UserToken.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role?.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter3466 = { '': { [Op.in]: role } };
      const routeRole4324 = await deleteRouteRole(routeRoleFilter3466);
      const userRoleFilter8851 = { 'roleId': { [Op.in]: role } };
      const userRole1665 = await deleteUserRole(userRoleFilter8851);
      return await Role.destroy({ where :filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectRoute?.length){
      projectRoute = projectRoute.map((obj) => obj.id);
      const routeRoleFilter4393 = { 'routeId': { [Op.in]: projectRoute } };
      const routeRole5727 = await deleteRouteRole(routeRoleFilter4393);
      return await ProjectRoute.destroy({ where :filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.destroy({ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user?.length){
      user = user.map((obj) => obj.id);
      const userFilter8628 = { 'addedBy': { [Op.in]: user } };
      const user4279Cnt = await countUser(userFilter8628);
      const userFilter5443 = { 'updatedBy': { [Op.in]: user } };
      const user9790Cnt = await countUser(userFilter5443);
      const userAuthSettingsFilter3578 = { 'userId': { [Op.in]: user } };
      const userAuthSettings6803Cnt = await countUserAuthSettings(userAuthSettingsFilter3578);
      const userTokenFilter6280 = { 'userId': { [Op.in]: user } };
      const userToken3038Cnt = await countUserToken(userTokenFilter6280);
      const userRoleFilter3669 = { 'userId': { [Op.in]: user } };
      const userRole0974Cnt = await countUserRole(userRoleFilter3669);
      const userCnt =  await User.count(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user4279Cnt,
        ...user9790Cnt,
        ...userAuthSettings6803Cnt,
        ...userToken3038Cnt,
        ...userRole0974Cnt,
      };
      return response;
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role?.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter7317 = { '': { [Op.in]: role } };
      const routeRole9250Cnt = await countRouteRole(routeRoleFilter7317);
      const userRoleFilter5797 = { 'roleId': { [Op.in]: role } };
      const userRole3192Cnt = await countUserRole(userRoleFilter5797);
      const roleCnt =  await Role.count(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole9250Cnt,
        ...userRole3192Cnt,
      };
      return response;
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectRoute?.length){
      projectRoute = projectRoute.map((obj) => obj.id);
      const routeRoleFilter6251 = { 'routeId': { [Op.in]: projectRoute } };
      const routeRole4105Cnt = await countRouteRole(routeRoleFilter6251);
      const projectRouteCnt =  await ProjectRoute.count(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole4105Cnt,
      };
      return response;
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user?.length){
      user = user.map((obj) => obj.id);
      const userFilter3699 = { 'addedBy': { [Op.in]: user } };
      const user4999 = await softDeleteUser(userFilter3699);
      const userFilter4725 = { 'updatedBy': { [Op.in]: user } };
      const user9961 = await softDeleteUser(userFilter4725);
      const userAuthSettingsFilter5942 = { 'userId': { [Op.in]: user } };
      const userAuthSettings8951 = await softDeleteUserAuthSettings(userAuthSettingsFilter5942);
      const userTokenFilter3489 = { 'userId': { [Op.in]: user } };
      const userToken0660 = await softDeleteUserToken(userTokenFilter3489);
      const userRoleFilter0428 = { 'userId': { [Op.in]: user } };
      const userRole0265 = await softDeleteUserRole(userRoleFilter0428);
      return await User.update(
        {
          isDeleted:true,
          isActive:false
        },{
          fields: ['isDeleted', 'isActive'],
          where: filter ,
        });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter) =>{
  try {
    return await UserAuthSettings.update(
      {
        isDeleted:true,
        isActive:false
      },{
        fields: ['isDeleted', 'isActive'],
        where: filter,
      });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter) =>{
  try {
    return await UserToken.update(
      {
        isDeleted:true,
        isActive:false
      },{
        fields: ['isDeleted', 'isActive'],
        where: filter,
      });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role?.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter0679 = { '': { [Op.in]: role } };
      const routeRole3647 = await softDeleteRouteRole(routeRoleFilter0679);
      const userRoleFilter4839 = { 'roleId': { [Op.in]: role } };
      const userRole6095 = await softDeleteUserRole(userRoleFilter4839);
      return await Role.update(
        {
          isDeleted:true,
          isActive:false
        },{
          fields: ['isDeleted', 'isActive'],
          where: filter ,
        });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectRoute?.length){
      projectRoute = projectRoute.map((obj) => obj.id);
      const routeRoleFilter6304 = { 'routeId': { [Op.in]: projectRoute } };
      const routeRole6397 = await softDeleteRouteRole(routeRoleFilter6304);
      return await ProjectRoute.update(
        {
          isDeleted:true,
          isActive:false
        },{
          fields: ['isDeleted', 'isActive'],
          where: filter ,
        });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.update(
      {
        isDeleted:true,
        isActive:false
      },{
        fields: ['isDeleted', 'isActive'],
        where: filter,
      });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter) =>{
  try {
    return await UserRole.update(
      {
        isDeleted:true,
        isActive:false
      },{
        fields: ['isDeleted', 'isActive'],
        where: filter,
      });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
