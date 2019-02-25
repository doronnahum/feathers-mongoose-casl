const Joi = require('../../utils/joi');
// const {Joi} = require('feathers-mongoose-casl');


const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    password: Joi.string()[required]().meta({ dashboard: { hide: 1}}),
    email: Joi.string().email().meta({ unique: true, lowercase: true })[required](),
    verifyChanges: Joi.object().meta({ dashboard: { hide: 1}}),
    resetToken: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    isVerified: Joi.boolean().allow(null).meta({ dashboard: { hideOnUpdate: 1}}),
    verifyToken: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    facebookId: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    auth0Id: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    githubId: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    googleId: Joi.string().allow(null).meta({ dashboard: { hide: 1}}),
    resetExpires: Joi.date().allow(null).meta({ dashboard: { hide: 1}}),
    verifyExpires: Joi.date().allow(null).meta({ dashboard: { hide: 1}}),
    roles: Joi.array().items(Joi.string()),
  });
};

module.exports = getJoiObject;

// const joi2json = require('../../feathers-mongoose-casl/joi2json');

// console.log(joi2json(Joi.object(getJoiObject(true))).properties.rules.items.meta)