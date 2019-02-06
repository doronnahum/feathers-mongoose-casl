const Joi = require('joi');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    name: Joi.string().min(5)[required](),
    description: Joi.string(),
    type: Joi.string().valid('private', 'public','blocked'),
    blocked: Joi.object({
      user:  Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' }),
      roles:  Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'name'})),
      blockAll: Joi.boolean()
    }),
    actions: Joi.array().items(Joi.string().valid('create', 'read','update','delete','manage'))[required](),
    subject: Joi.array().items(Joi.string()),
    fields: Joi.array(),
    conditions: Joi.object(),
    active: Joi.boolean(),
    from: Joi.date(),
    to: Joi.date(),
  });
};

module.exports = getJoiObject;
// const joi2json = require('../../feathers-mongoose-casl/joi2json');

// console.log(joi2json(Joi.object(getJoiObject(true))))