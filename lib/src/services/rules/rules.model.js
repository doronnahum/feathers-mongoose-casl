// rules-model.js - A mongoose model
const rulesValidators = require('./rules.validators.js');
const createModelFromJoi= require('../../utils/createModelFromJoi');
// const {createModelFromJoi}= require('feathers-mongoose-casl');


module.exports = function (app) {
  return createModelFromJoi(app, 'rules', rulesValidators);
};
