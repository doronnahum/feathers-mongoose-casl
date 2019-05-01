// users-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const usersValidators = require('./users.validators');
// feathers-mongoose-casl
// ------------------------
const createModelFromJoi = require('../../utils/createModelFromJoi');
// //un comment to copy to your src folder
// const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'users', usersValidators);
};
