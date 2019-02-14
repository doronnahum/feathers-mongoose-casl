// files-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const filesValidators = require('./files.validators.js');
const createModelFromJoi = require('../../utils/createModelFromJoi');
// const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'files', filesValidators);
};
