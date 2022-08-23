/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 *
 */

const joi = require('joi');
exports.schemaKeys = joi.object({
  userId: joi.number().integer(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);
exports.updateSchemaKeys = joi.object({
  userId: joi.number().integer(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);
