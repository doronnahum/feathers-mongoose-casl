// const {joiCustomRules, Joi as _Joi} = require('feathers-mongoose-casl');
const _Joi = require('../../utils/joi');
const {joiCustomRules} = require('../../utils/helpers');
const Joi = _Joi.extend(joiCustomRules.stringify);


const getJoiObject = function(withRequired) {
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    actions: Joi.array().items(Joi.string().valid('create', 'read', 'update', 'delete', 'manage'))[required](),
    subject: Joi.array().items(Joi.string())[required](),
    fields: Joi.array(),
    whitelistPopulate: Joi.array(),
    active: Joi.boolean().meta({ dashboard: { initialValue: true } }),
    from: Joi.date(),
    to: Joi.date(),
    conditions: Joi.string().stringify(),
    anonymousUser: Joi.boolean().meta({dashboard: { initialValue: false }}),
    userContext: Joi.string().stringify(),
    roles: Joi.array(),
  });
};

module.exports = getJoiObject;