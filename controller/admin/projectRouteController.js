const { Op } = require('sequelize');
const ProjectRoute = require('../../model/projectRoute');
const utils = require('../../utils/messages');
const projectRouteSchemaKey = require('../../utils/validation/projectRouteValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const deleteDependentService = require('../../utils/deleteDependent');
const addProjectRoute = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      projectRouteSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    const data = ({ ...req.body, });
    let result = await dbService.createOne(ProjectRoute,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertProjectRoute = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.createMany(ProjectRoute,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const findAllProjectRoute = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body?.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      result = await dbService.count(ProjectRoute, query);
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
      result = await dbService.findMany( ProjectRoute,query,options);
            
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

const getProjectRoute = async (req, res) => {
  try {
    let query = {};

    let id = req.params.id;
        
    let result = await dbService.findByPk(ProjectRoute,id,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateProjectRoute = async (req, res) => {
  try {
    const data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      projectRouteSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    const query = { id:req.params.id };
    let result = await dbService.updateMany(ProjectRoute, query, data);
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const softDeleteProjectRoute = async (req, res) => {
  try {
    let possibleDependent = [ {
      model: 'routeRole',
      refId: 'routeId' 
    } ];
    let id = req.params.id;
    let query = { id:id };
    let result = await deleteDependentService.softDeleteProjectRoute(query);
    if (!result){
      return utils.failureResponse('something went wrong',res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const updateProjectRoute = async (req, res) => {
  try {
    const data = { ...req.body, };
    let isValid = validation.validateParamsWithJoi(
      data,
      projectRouteSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }

    let query = { id:req.params.id };
    let result = await dbService.updateMany(ProjectRoute,query,data);
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }

    return  utils.successResponse(result, res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getProjectRouteCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.count(ProjectRoute,where);
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
      projectRouteSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let result = await dbService.upsert(ProjectRoute,req.body);

    return  utils.successResponse(result, res);    
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

module.exports = {
  addProjectRoute,
  bulkInsertProjectRoute,
  findAllProjectRoute,
  getProjectRoute,
  partialUpdateProjectRoute,
  softDeleteProjectRoute,
  updateProjectRoute,
  getProjectRouteCount,
  upsert,
};
