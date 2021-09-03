const { Op } = require('sequelize');
const UserRole = require('../../model/userRole');
const utils = require('../../utils/messages');
const userRoleSchemaKey = require('../../utils/validation/userRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const addUserRole = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      userRoleSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    const data = ({ ...req.body, });
    let result = await dbService.createOne(UserRole,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertUserRole = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.createMany(UserRole,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const findAllUserRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body?.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      result = await dbService.count(UserRole, query);
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
      result = await dbService.findMany( UserRole,query,options);
            
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

const getUserRole = async (req, res) => {
  try {
    let query = {};

    let id = req.params.id;
        
    let result = await dbService.findByPk(UserRole,id,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateUserRole = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userRoleSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(UserRole, query, data);
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const updateUserRole = async (req, res) => {
  try {
    const data = { ...req.body, };
    let isValid = validation.validateParamsWithJoi(
      data,
      userRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(UserRole,query,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }

    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const softDeleteUserRole = async (req, res) => {
  try {
    let query = { id:req.params.id };

    let result = await dbService.softDeleteMany(UserRole, query, { isDeleted: true },{ new:true });
    if (!result){
      return utils.recordNotFound([],res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const getUserRoleCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(UserRole,where);
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

const upsert = async (req, res) => {
  try {
    let params = req.body;
    let isValid = validation.validateParamsWithJoi(
      params,
      userRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let result = await dbService.upsert(UserRole,req.body);

    return  utils.successResponse(result, res);    
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

module.exports = {
  addUserRole,
  bulkInsertUserRole,
  findAllUserRole,
  getUserRole,
  partialUpdateUserRole,
  updateUserRole,
  softDeleteUserRole,
  getUserRoleCount,
  upsert,
};
