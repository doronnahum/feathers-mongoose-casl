// const {joiCustomRules, Joi as _Joi} = require('feathers-mongoose-casl');
const Joi = require('../../utils/joi');
const {joiCustomRules} = require('../../utils/helpers');
const _Joi = Joi.extend(joiCustomRules.stringify);


const getJoiObject = function(withRequired) {
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    actions: Joi.array().items(Joi.string().valid('create', 'read', 'update', 'delete', 'manage'))[required](),
    subject: Joi.array().items(Joi.string())[required](),
    fields: Joi.array().meta({dashboard: {list: {hide: 1}}}),
    populateWhitelist: Joi.array(),
    active: Joi.boolean().meta({ dashboard: {doc: { initialValue: true }} }),
    from: Joi.date().meta({ dashboard: {list: { hide: true }} }),
    to: Joi.date().meta({ dashboard: {list: { hide: true }} }),
    anonymousUser: Joi.boolean().meta({dashboard: {doc: { initialValue: false }}}),
    conditions: _Joi.string().stringify(),
    userContext: _Joi.string().stringify().meta({ dashboard: {list: { hide: true }} }),
    roles: Joi.array().items(Joi.string()),
  });
};

module.exports = getJoiObject;