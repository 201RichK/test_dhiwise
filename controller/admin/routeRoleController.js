const { Op } = require('sequelize');
const RouteRole = require('../../model/routeRole');
const utils = require('../../utils/messages');
const routeRoleSchemaKey = require('../../utils/validation/routeRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const addRouteRole = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      routeRoleSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    const data = ({ ...req.body, });
    let result = await dbService.createOne(RouteRole,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertRouteRole = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.createMany(RouteRole,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const findAllRouteRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body?.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      result = await dbService.count(RouteRole, query);
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
      result = await dbService.findMany( RouteRole,query,options);
            
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

const getRouteRole = async (req, res) => {
  try {
    let query = {};

    let id = req.params.id;
        
    let result = await dbService.findByPk(RouteRole,id,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateRouteRole = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      routeRoleSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(RouteRole, query, data);
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const updateRouteRole = async (req, res) => {
  try {
    const data = { ...req.body, };
    let isValid = validation.validateParamsWithJoi(
      data,
      routeRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(RouteRole,query,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }

    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const softDeleteRouteRole = async (req, res) => {
  try {
    let query = { id:req.params.id };

    let result = await dbService.softDeleteMany(RouteRole, query, { isDeleted: true },{ new:true });
    if (!result){
      return utils.recordNotFound([],res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const getRouteRoleCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(RouteRole,where);
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
      routeRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let result = await dbService.upsert(RouteRole,req.body);

    return  utils.successResponse(result, res);    
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

module.exports = {
  addRouteRole,
  bulkInsertRouteRole,
  findAllRouteRole,
  getRouteRole,
  partialUpdateRouteRole,
  updateRouteRole,
  softDeleteRouteRole,
  getRouteRoleCount,
  upsert,
};
