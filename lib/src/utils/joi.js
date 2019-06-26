
/**
 * Export [Joi] with [objectId] validator
 */
const Joi = require('joi');
// @ts-ignore
Joi.objectId = require('joi-objectid')(Joi); // We need this to convert joi to mongoose

module.exports = Joi;