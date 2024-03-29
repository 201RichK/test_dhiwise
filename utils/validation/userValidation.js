/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 *
 */

const joi = require('joi');
const { USER_ROLE } = require('../../constants/authConstant');
const { convertObjectToEnum } = require('../common');  
 
exports.schemaKeys = joi.object({
  username: joi.string(),
  password: joi.string(),
  name: joi.string(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  username: joi.string(),
  password: joi.string(),
  name: joi.string(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);
