// Initializes the `files` service on path `/files`

const createService = require('../../utils/createService');
const uploadMiddleware = require('../../utils/uploadMiddleware');
const STORAGE_TYPES = require('../../enums').STORAGE_TYPES;
// const {createService, enums, uploadMiddleware, STORAGE_TYPES} = require('feathers-mongoose-casl');
const createModel = require('./files.model');
const hooks = require('./files.hooks');
const FILE_KEY_NAME = 'file';

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    dashboardConfig: {
      sideBarIconName: 'file'
    }
  };

  // Initialize our service with any options it requires
  app.use('/files',
    uploadMiddleware({
      app,
      fileKeyName: 'file',
      serviceName: 'files',
      storageService: STORAGE_TYPES['google-cloud'],
      public: true,
      mimetypes: null // ['image/png','image/jpeg'] // optional - array of mimetypes to allow
    }),
    createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
