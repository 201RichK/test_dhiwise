const { Op } = require('sequelize');
const User = require('../../model/user');
const utils = require('../../utils/messages');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const auth = require('../../services/auth');
const deleteDependentService = require('../../utils/deleteDependent');
const addUser = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    const data = ({ ...req.body, });
    let result = await dbService.createOne(User,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message,res); 
  }
};

const findAllUser = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body?.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      if (req.user){
        query = {
          ...query,
          ...{ 'id': { [Op.ne]: req.user.id } } 
        };
        if (req.body?.query?.id) {
          Object.assign(query.id, { [Op.in]: [req.body.query.id] });
        }
      }
      result = await dbService.count(User, query);
      if (result) {
        result = { totalRecords: result };
        return utils.successResponse(result, res);
      } 
      return utils.recordNotFound([], res);
    }
    else {
      if (req.body?.options !== undefined) {
        options = { ...req.body.options };
      }
      if (options && options.select && options.select.length){
        options.attributes = options.select;
      }
            
      if (req.body.query !== undefined){
        query = { ...req.body.query };
      }
      if (req.user){
        query = {
          ...query,
          ...{ 'id': { [Op.ne]: req.user.id } } 
        };
        if (req.body?.query?.id) {
          Object.assign(query.id, { [Op.in]: [req.body.query.id] });
        }
      }
      result = await dbService.findMany( User,query,options);
            
      if (!result){
        return utils.recordNotFound([],res);
      }
      return utils.successResponse(result, res);   
    }
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUser = async (req, res) => {
  try {
    let query = {};

    let id = req.params.id;
        
    let result = await dbService.findByPk(User,id,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUserCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(User,where);
    if (result){
      result = { totalRecords:result };
      return utils.successResponse(result, res);
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const updateUser = async (req, res) => {
  try {
    const data = { ...req.body, };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return util.badRequest({},res);
    }
    let result = await dbService.updateMany(User,query,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }

    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateUser = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: req.params.id,
          [Op.ne]: req.user.id
        }
      };
    } else {
      return util.badRequest({},res);
    } 
    let result = await dbService.updateMany(User, query, data);
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const softDeleteUser = async (req, res) => {
  try {
    let possibleDependent = [
      {
        model: 'user',
        refId: 'addedBy' 
      },
      {
        model: 'user',
        refId: 'updatedBy' 
      },
      {
        model: 'userAuthSettings',
        refId: 'userId' 
      },
      {
        model: 'userToken',
        refId: 'userId' 
      },
      {
        model: 'userRole',
        refId: 'userId' 
      }
    ];
    let id = req.params.id;
    let query = {};
    if (req.user){
      query = {
        'id': {
          [Op.eq]: id,
          [Op.ne]: req.user.id
        }
      };
    } 
    let result = await deleteDependentService.softDeleteUser(query);
    if (!result){
      return utils.failureResponse('something went wrong',res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const softDeleteManyUser = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      let query = {};
      if (req.user){
        query = {
          'id': {
            [Op.in]: ids,
            [Op.ne]: req.user.id
          }
        };
      } 
      let result = deleteDependentService.softDeleteUser(query);
      if (!result) {
        return utils.recordNotFound([],res);
      }
      return  utils.successResponse(result, res);
    }
    return utils.badRequest({},res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertUser = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.createMany(User,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const bulkUpdateUser = async (req,res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = req.body.data;
      let result = await dbService.updateMany(User,filter,data);
      if (!result){
        return utils.failureResponse('something is wrong.',res);
      }

      return  utils.successResponse(result, res);
    }
    else {
      return utils.failureResponse('Invalid Data', res);
    }
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!params.newPassword || !req.user.id || !params.oldPassword) {
      return utils.inValidParam({}, res);
    }
    let result = await auth.changePassword({
      ...params,
      userId:req.user.id
    });
    if (result.flag){
      return utils.changePasswordFailure(result.data,res);
    }
    return utils.changePasswordSuccess(result.data, res);
  } catch (error) {
    return utils.failureResponse(error.message, res);
  }
};
const updateProfile = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id:req.user.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }
    if (data.password) delete data.password;
    if (data.createdAt) delete data.createdAt;
    if (data.updatedAt) delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.updateByPk(User, req.user.id ,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }            
    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

module.exports = {
  addUser,
  findAllUser,
  getUser,
  getUserCount,
  updateUser,
  partialUpdateUser,
  softDeleteUser,
  softDeleteManyUser,
  bulkInsertUser,
  bulkUpdateUser,
  changePassword,
  updateProfile,
};
