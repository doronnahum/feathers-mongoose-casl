const enums = require('../../../enums');
const STORAGE_TYPES = enums.STORAGE_TYPES;
const { GeneralError } = require('@feathersjs/errors');

/**
 * @function getFileUrl
 * Build full url by the storage type,
 * when the storage is local we use get-file without serverUrl, in this way we can support the DB even if server url is changed
 * @param {object} payload
 * @param {object} payload.app
 * @param {string} payload.storageService // storageService name, oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {string} payload.fileId // file id in storage service
 */
const getFileUrl = function (payload) {
  try {
    const {
      app,
      storageService,
      fileId
    } = payload;
    let fileUrl;
    if (storageService === STORAGE_TYPES['local-private']) {
      fileUrl = `${app.get('feathers-mongoose-casl').privateFolder}/uploads/${fileId}`;
    }
    if (storageService === STORAGE_TYPES['local-public']) {
      let serverUrl = app.get('host') || app.get('serverUrl');
      if (!serverUrl) throw new Error('missing serverUrl is appConfig');
      if (serverUrl === 'localhost') {
        serverUrl = `${serverUrl}:${app.get('port')}`;
      }
      fileUrl = `${serverUrl}/uploads/${fileId}`;
    }
    if (storageService === STORAGE_TYPES.s3) {
      fileUrl = `https://${app.get('s3').bucket}.s3.amazonaws.com/${fileId}`;
    }
    if (storageService === STORAGE_TYPES['google-cloud'] || storageService === 'google-storage') { // google-storage only in version before 1.5.0
      fileUrl = `https://storage.googleapis.com/${app.get('google-cloud').bucket}/${fileId}`;
    }
    return fileUrl;
  } catch (error) {
    payload.app.error('feathers-mongoose-casl - feathers-mongoose-casl/src/utils/uploadMiddleware/utils/getFileUrl.js', error);
    throw new GeneralError();
  }
};

module.exports = getFileUrl;
