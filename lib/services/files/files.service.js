// Initializes the `files` service on path `/files`
const createService = require('feathers-mongoose');
const createModel = require('../../models/files.model');
const hooks = require('./files.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/files', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
