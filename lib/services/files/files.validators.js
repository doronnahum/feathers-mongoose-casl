const Joi = require('../../utils/joi');
// const {Joi} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    url: Joi.string()[required](),
    fileId: Joi.string()[required](),
    storage: Joi.string().valid('s3', 'static'),
    user: Joi.objectId().meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' })
  });
};

module.exports = getJoiObject;