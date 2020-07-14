// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const debug = require('debug')('feathers-mongoose-casl');
const { UPLOAD_PUBLIC_FILE_KEY } = require('../../enums');

/**
 * @function uploadToGoogle
 * @description async function to upload file to google-cloud
 * @return {object}  res: { id: '4b895c04-0bd6-4e00-8f13-6a3964ad5a32be-good.jpg' }
 */
const uploadToGoogle = function ({ app, fileToUpload }) {
  return new Promise(function (resolve, reject) {
    const googleConfig = app.get('google-cloud');
    const storage = new Storage({
      projectId: googleConfig.projectId,
      keyFilename: googleConfig.keyFilename
    });
    const bucket = storage.bucket(googleConfig.bucket);

    const gcsname = uuidv4() + fileToUpload.originalname;
    const file = bucket.file(gcsname);
    const stream = file.createWriteStream({
      metadata: {
        contentType: fileToUpload.mimetype
      }
    });

    stream.on('error', reject);

    stream.on('finish', () => {
      resolve({ id: gcsname });
    });
    stream.end(fileToUpload.buffer);
  });
};

module.exports = function (app) {
  if (app.get('google-cloud') && app.get('google-cloud').projectId) {
    const googleConfig = app.get('google-cloud');
    const storage = new Storage({
      projectId: googleConfig.projectId,
      keyFilename: googleConfig.keyFilename
    });
    const bucket = storage.bucket(googleConfig.bucket);
    app.use('/uploads-google',
      {
        async create (data, params) {
          const res = await uploadToGoogle({ app, fileToUpload: data.buffer });
          const file = bucket.file(res.id);
          if (params[UPLOAD_PUBLIC_FILE_KEY]) {
            file.makePublic();
          }
          return Promise.resolve(res);
        },
        async remove (fileId) {
          const file = bucket.file(fileId);
          file.delete().then(function () {
            debug('uploads service - remove file from google cloud', { fileId });
          }).catch(function (err) {
            app.error('feathers-mongoose-casl - uploads service - remove file from google cloud failed', { fileId, err });
          });
        }
      }
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('uploads-google');

    service.hooks(hooks);
  }
};
