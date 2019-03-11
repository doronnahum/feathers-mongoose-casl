const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); // We need this to convert joi to mongoose

module.exports = Joi;