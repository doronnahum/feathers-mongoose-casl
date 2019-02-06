
var timestamps = require('mongoose-timestamp');
const Joigoose = require('joigoose');

const { accessibleFieldsPlugin } = require('@casl/mongoose');

/**
 * @function createModelFromJoi
 * This function receive getJoi() function that return joi schema and return mongoose model;
 * and also set the getJoi reference to app for future validators check and dashboard service
 */
module.exports  = function (app, name, getJoi) {
  
  const mongooseClient = app.get('mongooseClient');
  
  const joiSchema = getJoi(false);
  const mongooseSchema = Joigoose(mongooseClient).convert(joiSchema);
  
  app.set(name + 'getJoi', getJoi); // Set getJoi reference to help us validate user requests
  
  const schema = new mongooseClient.Schema(mongooseSchema, {validateBeforeSave:false}); // validateBeforeSave is off, joi in enough
  schema.plugin(timestamps);
  schema.plugin(accessibleFieldsPlugin); // @casl/mongoose - field permissions - this will help us sanitized data
  
  schema.pre('updateMany', function(next) { // missing in mongoose-timestamp
    const self = this;
    self._update.updatedAt = new Date;
    next();
  });
  
  return mongooseClient.model(name, schema);
};


// Example of use
//----------------------------
// src/models/posts.model.js


// const postsValidators = require('../validators/posts.validators.js');
// const createModelFromJoi = require('../utils/createModelFromJoi');

// module.exports = function (app) {
//   return createModelFromJoi(app, 'posts', postsValidators);
// };
