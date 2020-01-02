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
        'enUS': {
          serviceName: 'Files',
          serviceNameMany: 'Files',
          serviceNameOne: 'File',
          fields: {
            '_id': 'ID',
            'updatedAt': 'Updated At',
            'createdAt': 'Created At',
            'name': 'Name',
            'file': 'File',
            'originalName': 'Original Name',
            'type': 'Type',
            'info': 'Info',
            'fileId': 'File ID',
            'storage': 'Storage',
            'uploadChannel': 'Upload Channel',
            'user': 'User'
        },
        'heIL': {
          serviceName: 'קבצים',
          serviceNameMany: 'קבצים',
          serviceNameOne: 'קובץ',
          fields: {
            '_id': 'מזהה',
            'updatedAt': 'תאריך עדכון',
            'createdAt': 'נוצר בתאריך',
            'name': 'שם',
            'file': 'קובץ',
            'originalName': 'שם מקורי',
            'type': 'סוג',
            'info': 'מידע',
            'fileId': 'מזהה קובץ',
            'storage': 'איחסון',
            'uploadChannel': 'ערוץ העלאה',
            'user': 'משתמש'
          }
        },
        'deDE': {
          serviceName: 'Dateien',
          serviceNameMany: 'Dateien',
          serviceNameOne: 'Datei',
          fields: {
            '_id': 'ID',
            'updatedAt': 'Aktualisiert am',
            'createdAt': 'Erstellt am',
            'name': 'Name',
            'file': 'Datei',
            'originalName': 'Originaler Name',
            'type': 'Typ',
            'info': 'Info',
            'fileId': 'Datei ID',
            'storage': 'Speicherort',
            'uploadChannel': 'Upload Channel',
            'user': 'Benutzer'
        },
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
      publicRead: true,
      mimetypes: null // ['image/png','image/jpeg'] // optional - array of mimetypes to allow
    }),
    createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
