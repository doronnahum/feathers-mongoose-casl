
const _createService = require('feathers-mongoose');

/**
 * @function createService
 * @description this is a wrapper of feathers-mongoose, we just add modelToSwagger for better swagger docs
 * @param {object} options
 *
 * In the previous version we add some logic here, for now this
 * file is not add any value
 */
const createService = function (options) {
  if (!options.Model || !options.Model.modelName) {
    throw new Error('You must provide a Mongoose Model');
  }
  const service = _createService(options);
  return service;
};

module.exports = createService;
