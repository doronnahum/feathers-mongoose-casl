// Initializes the `files` service on path `/files`

const createService = require('../../utils/createService');
const uploadMiddleware = require('../../utils/uploadMiddleware');
const STORAGE_TYPES = require('../../enums').STORAGE_TYPES;
// const {createService, enums, uploadMiddleware, STORAGE_TYPES} = require('feathers-mongoose-casl');
const createModel = require('./files.model');
const hooks = require('./files.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    dashboardConfig: {
      sideBarIconName: 'file',
      i18n: {
        "heIL": {
          serviceName: 'קבצים',
          serviceNameMany: 'קבצים',
          serviceNameOne: 'קובץ',
          fields: {
            "_id": "מזהה",
            "updatedAt": "תאריך עדכון",
            "createdAt": "נוצר בתאריך",
            "name": "שם",
            "file": "קובץ",
            "originalName": "שם מקורי",
            "type": "סוג",
            "info": "מידע",
            "fileId": "מזהה קובץ",
            "storage": "איחסון",
            "uploadChannel": "ערוץ העלאה",
            "user": "משתמש",
          }
        }
      }
    }
  };

  // Initialize our service with any options it requires
  app.use('/files',
    uploadMiddleware({
      app,
      fileKeyName: 'file',
      serviceName: 'files',
      storageService: STORAGE_TYPES['local-public'],
      public: true,
      mimetypes: null // ['image/png','image/jpeg'] // optional - array of mimetypes to allow
    }),
    createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
