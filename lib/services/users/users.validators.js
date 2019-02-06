const Joi = require('joi');


const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    password: Joi.string()[required](),
    email: Joi.string().email().meta({ unique: true, lowercase: true })[required](),
    verifyChanges: Joi.object().allow(null),
    resetToken: Joi.string().allow(null),
    isVerified: Joi.boolean().allow(null),
    verifyToken: Joi.string().allow(null),
    facebookId: Joi.string().allow(null),
    auth0Id: Joi.string().allow(null),
    githubId: Joi.string().allow(null),
    googleId: Joi.string().allow(null),
    resetExpires: Joi.date().allow(null),
    verifyExpires: Joi.date().allow(null),
    roles: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'roles', displayKey: 'name' })),
  });
};

module.exports = getJoiObject;

// const joi2json = require('../../feathers-mongoose-casl/joi2json');

// console.log(joi2json(Joi.object(getJoiObject(true))).properties.roles.items.meta)