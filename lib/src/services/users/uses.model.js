// users-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const usersValidators = require('./users.validators');
const createModelFromJoi = require('../../utils/createModelFromJoi');
// const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'users', usersValidators);
};
