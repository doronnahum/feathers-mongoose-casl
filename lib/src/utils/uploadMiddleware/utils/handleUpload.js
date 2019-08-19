const { UPLOAD_PUBLIC_FILE_KEY, STORAGE_TYPES } = require('../../../enums');
const uuidv4 = require('uuid/v4');
const getFileUrl = require('./getFileUrl');

const handleUpload = async function (params) {
  const { app, req, fileKeyName, uploadService, storageService } = params;
  const _public = params.public;
  try {
    const isFile = req[fileKeyName] && typeof req[fileKeyName] === 'object';
    const isUrlLink = !isFile && req[fileKeyName] && typeof req[fileKeyName] === 'string';

    if (isFile) {
      /**
       * Get file info
       */
      const originalName = req[fileKeyName].originalname;
      const fileId = uuidv4() + '--' + originalName;

      /**
       * Upload the file to storage
       */
      const upload = await uploadService.create({ fileId, buffer: req[fileKeyName], [UPLOAD_PUBLIC_FILE_KEY]: _public });

      /**
       * uploadService return the file id in the storage
       */
      if (upload && upload.id) {
        /**
         * get File Url
         * --------------------------------------------------------------------------------
         * get file url will return link to the file in the storage, for example:
         * `${serverUrl}:${app.get('port')}`;
         * `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
         * --------------------------------------------------------------------------------
         */
        const fileUrl = getFileUrl({ app, fileId: upload.id, storageService });

        /**
         * Request data
         * --------------------------------------------------------------------------------
         * Add to request data info about the file , this info will be saved on the document in DB
         * --------------------------------------------------------------------------------
         * */
        req.body[fileKeyName] = fileUrl;
        req.body.storage = storageService;
        req.body.fileId = upload.id;
        req.body.originalName = originalName;
      } else {
        throw new Error('src/feathers-mongoose-casl/src/utils/uploadMiddleware/utils/handleUpload.js failed to upload a file');
      }
    } else if (isUrlLink) {
      /**
       * When request include a file that is a string (this is link to a file and not a real file)
       * then we add to request data storage equal to others
       */
      req.body.storage = STORAGE_TYPES.others;
    }
  } catch (error) {
    app.error('feathers-mongoose-casl/src/utils/uploadMiddleware/utils/handleUpload.js', error);
    throw error;
  }
};

module.exports = handleUpload;
