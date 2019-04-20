// Initializes the `files` service on path `/files`

const createService = require('../../utils/createService');
const createUploadMiddleware = require('../../utils/createUploadMiddleware');
const STORAGE_TYPES = require('../../enums').STORAGE_TYPES;
// const {createService, enums, createUploadMiddleware, STORAGE_TYPES} = require('feathers-mongoose-casl');
const createModel = require('./files.model');
const hooks = require('./files.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
const FILE_KEY_NAME = 'file';

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/files',
    multipartMiddleware.single(FILE_KEY_NAME),
    createUploadMiddleware({
      app,
      fileKeyName: FILE_KEY_NAME,
      serviceName: 'files',
      storageService: STORAGE_TYPES.s3,
      publicAcl: false
    }),
    createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
