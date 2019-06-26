
var timestamps = require('mongoose-timestamp');
const Joigoose = require('joigoose');
const {setJoiInstance, getJoiInstance} = require('../utils/helpers');
const { accessibleFieldsPlugin } = require('@casl/mongoose');

/**
  * @function createModelFromJoi
  * @description This function receive getJoiSchema() function
  * getJoiSchema is function that return JOI schema;
  * ------------------------------------------------------------------
  * The function do 3 things:
  * ------------------------------------------------------------------
  * 1 - Save a reference to getJoiSchema inside the app, using [setJoiInstance]
  * 2 - Convert JOI to mongoose schema
  * 3 - Return mongoose model
  * 
  * We used this function inside feathers someService.model.js file
  * 
  * createModelFromJoi params:
  * ------------------------------------------------------------------
  * @param {object} app Feather app
  * @param {string} name  name of the service
  * @param {function} getJoiSchema pass function that will return a JOI schema
  * @param {object} [mongooseSchema] (optional) - pass mongooseSchema if you want to use  mongoose schema and not to convert JOI to mongoose schema
  * @return mongoose model
  * 
  * @example
  * const postsValidators = require('../validators/posts.validators.js');
  * const {createModelFromJoi} = require('feathers-mongoose-casl');
  * 
  * module.exports = function (app) {
  *   return createModelFromJoi(app, 'posts', postsValidators);
  * }
  */
const createModelFromJoi = function (app, name, getJoiSchema, mongooseSchema) {
  
  const mongooseClient = app.get('mongooseClient');

  /**
   *  This is here because we want to allow override the built in services
   *  validator without copt the service to local service folder, use like that:
   *  const {services, setJoiInstance} = require('feathers-mongoose-casl');
   *  setJoiInstance(app, 'users', getJoiSchema)
   *  app.configure(services.users);
   */
  const _getJoiSchema = getJoiInstance(app, name);

  /**
   * Get joi schema
   * we pass false because we didn't want mongoose to validate for us the
   * required fields, JOI do this for us
   */
  const joiSchema = _getJoiSchema ? _getJoiSchema(false) : getJoiSchema(false);
  
  /**
   * Convert to mongoose schema or used mongooseSchema from attributes
   */
  const _mongooseSchema =  mongooseSchema || Joigoose(mongooseClient, null, { _id: false, timestamps: false }).convert(joiSchema);
  
  /**
   * save a reference to getJoiSchema 
   * ----------------------------------------------------------------------------
   * save a reference to getJoiSchema  inside the app, using [setJoiInstance] 
   * with this reference we can validate client request and convert JOI to JSON schema for the dashboard
   */
  if(!_getJoiSchema){
    setJoiInstance(app, name, getJoiSchema); // Set getJoi reference to help us validate user requests
  }

  /**
   * Create new mongooseClient schema
   * ------------------------------------------------------------------
   * We turn off the mongoose validateBeforeSave, JOI make the validation
   * ------------------------------------------------------------------
   * 
   */
  const schema = new mongooseClient.Schema(_mongooseSchema, {validateBeforeSave: false});
  
  /**
   * Add createdAt an updatedAt fields to all collections
   */
  schema.plugin(timestamps);

  /**
   * @casl/mongoose
   * ------------------------------------------------------------------
   * field permissions -
   * this will help us sanitized data
   * ------------------------------------------------------------------
   */
  schema.plugin(accessibleFieldsPlugin);
  
  /**
   * Add updateMany - this was missing in mongoose-timestamp
   */
  schema.pre('updateMany', function(next) { 
    const self = this;
    self._update.updatedAt = new Date;
    next();
  });
  
  /**
   * Return mongoose model
   */
  return mongooseClient.model(name, schema);
};


module.exports = createModelFromJoi;