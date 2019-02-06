const Joi = require('joi');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    url: Joi.string()[required](),
    fileId: Joi.string()[required](),
    storage: Joi.string().valid('s3', 'static'),
    user: Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' })
  });
};

module.exports = getJoiObject;