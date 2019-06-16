

const _createService = require('feathers-mongoose');

/**
 * @function createService
 * @param {*} options 
 * this is a wrapper of feathers-mongoose, we just add modelToSwagger for better swagger docs
 */
const createService = function(options){
  if (!options.Model || !options.Model.modelName) {
    throw new Error('You must provide a Mongoose Model');
  }
  const service = _createService(options);
  return service;
};

module.exports = createService;