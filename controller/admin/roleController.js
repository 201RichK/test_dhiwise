const { Op } = require('sequelize');
const Role = require('../../model/role');
const utils = require('../../utils/messages');
const roleSchemaKey = require('../../utils/validation/roleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const deleteDependentService = require('../../utils/deleteDependent');
const addRole = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      roleSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    const data = ({ ...req.body, });
    let result = await dbService.createOne(Role,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertRole = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.createMany(Role,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const findAllRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body?.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      result = await dbService.count(Role, query);
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
      result = await dbService.findMany( Role,query,options);
            
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

const getRole = async (req, res) => {
  try {
    let query = {};

    let id = req.params.id;
        
    let result = await dbService.findByPk(Role,id,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateRole = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      roleSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(Role, query, data);
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const softDeleteRole = async (req, res) => {
  try {
    let possibleDependent = [
      {
        model: 'routeRole',
        refId: '' 
      },
      {
        model: 'userRole',
        refId: 'roleId' 
      }
    ];
    let id = req.params.id;
    let query = { id:id };
    let result = await deleteDependentService.softDeleteRole(query);
    if (!result){
      return utils.failureResponse('something went wrong',res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const updateRole = async (req, res) => {
  try {
    const data = { ...req.body, };
    let isValid = validation.validateParamsWithJoi(
      data,
      roleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(Role,query,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }

    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getRoleCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(Role,where);
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
      roleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let result = await dbService.upsert(Role,req.body);

    return  utils.successResponse(result, res);    
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

module.exports = {
  addRole,
  bulkInsertRole,
  findAllRole,
  getRole,
  partialUpdateRole,
  softDeleteRole,
  updateRole,
  getRoleCount,
  upsert,
};
