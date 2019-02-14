const Joi = require('../../utils/joi');
// const {Joi} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    // Data from user
    file: Joi.string().meta({ inputType: 'file' }),
    type: Joi.string(),
    info: Joi.string(),
    // Data from upload service
    fileId: Joi.string().meta({ 'readOnly': true }),
    storage: Joi.string().valid('s3', 'static', 'other').meta({ 'readOnly': true }),
    uploadChannel: Joi.string().valid('site', 'bo', 'app').meta({ 'readOnly': true }),
    user: Joi.objectId().meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' }).meta({ 'readOnly': true }),
  });
};

module.exports = getJoiObject;