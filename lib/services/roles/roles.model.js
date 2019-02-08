// roles-model.js - A mongoose model
const rolesValidators = require('./roles.validators.js');
const createModelFromJoi= require('../../utils/createModelFromJoi');
// const {createModelFromJoi}= require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'roles', rolesValidators);
};
