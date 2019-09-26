const { UPLOAD_SERVICES } = require('../../enums');
const getFileFromRequest = require('./utils/getFileFromRequest');
const { GeneralError, BadRequest } = require('@feathersjs/errors');

const getMulter = require('./utils/getMulter');
const validateConfiguration = require('./utils/validateConfiguration');

const handleDelete = require('./utils/handleDelete');
const handleUpdate = require('./utils/handleUpdate');
const handleUpload = require('./utils/handleUpload');

/**
 * @function uploadMiddleware
 * @description  * This middleware is used by any service that want to upload a file to storage
 * the upload done by the one of the upload services base of the storageService
 * storageService can be one of: ['local_private','local_public','s3','google-cloud']
 * and the upload will be done with one of the upload services:
 * [app.service('upload-local-private')]
 * [app.service('upload-local-public')]
 * [app.service('uploads-s3')]
 * [app.service('uploads-google')]
 *
 * @param {object}  config
 * @param {object}  config.app                  The feathers app
 * @param {string}  [config.fileKeyName='file'] The field name of the file, default is 'file'
 * @param {string}  config.serviceName          The service name
 * @param {string}  config.storageService       oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {boolean} config.publicRead            set true if you want the file to be public
 * @param {array}   [config.mimetypes]          pass array with mimetypes to filter what files your want to allow
 *
 */
const uploadMiddleware = function (config) {
  // Support previous version
  if (
    !config.hasOwnProperty('publicRead')
    && (config.hasOwnProperty('public') || config.hasOwnProperty('protectTheFile'))
  ) {
    // @ts-ignore
    if (config.hasOwnProperty('public')) config.publicRead = config.public;
    // @ts-ignore
    if (config.hasOwnProperty('protectTheFile')) config.publicRead = !config.protectTheFile;
  }
  const {
    app,
    fileKeyName = 'file',
    serviceName,
    storageService,
    publicRead = false,
    mimetypes
  } = config;

  /**
   * Validate config
   * --------------------------------------------------------------------------------
   * When service is setup with a middleware we validate that storage is exists
   * --------------------------------------------------------------------------------
  */
  validateConfiguration(config);
  const multipartMiddleware = getMulter(mimetypes);

  return async function (req, res, next) {
    /**
     * Define the upload service
     */
    const uploadServiceName = UPLOAD_SERVICES[storageService];
    const uploadService = app.service(uploadServiceName);
    if (req.method === 'GET') {
      /**
       * GET request
       * --------------------------------------------------------------------------------
       * uploadMiddleware is not relevant when client GET document from DB
       * --------------------------------------------------------------------------------
       */
      return next();
    } else if (req.method === 'DELETE') {
      /*
      *
      * DELETE
      * --------------------------------------------------------------------------------
      * When service get delete request,
      * this middleware will delete the file from the storage
      * before deleting the document from the DB
      * --------------------------------------------------------------------------------
      *
      */
      await handleDelete({ app, req, serviceName, uploadService });
      return next();
    } else {
      /**
     * get File From Request
     * --------------------------------------------------------------------------------
     * This function will add the file inside [req[fileKeyName]] with multer
     * --------------------------------------------------------------------------------
     *
     */
      try {
        await getFileFromRequest(multipartMiddleware, req, res, fileKeyName); // async  multer
      } catch (error) {
        app.debug('feathers-mongoose-casl > src> utils > uploadMiddleware - failed to upload a file ', error);
        if (error.message.includes('Accept')) {
          /**
           * File type is not acceptable
           */
          return next(new BadRequest(error.message));
        } else {
          return next(new GeneralError('upload failed'));
        }
      }

      /*
      *
      * UPDATE
      * --------------------------------------------------------------------------------
      * When service get update request
      * If the client send a file we want to remove the old file before we upload the new file
      * --------------------------------------------------------------------------------
      *
      */
      if (['PATCH', 'PUT'].includes(req.method) && req[fileKeyName]) {
        try {
          await handleUpdate({ app, req, serviceName, uploadService });
        } catch (error) {
          return next(new GeneralError('upload failed'));
        }
      }

      try {
        await handleUpload({ app, req, fileKeyName, uploadService, publicRead, storageService });
      } catch (error) {
        return next(new GeneralError('upload failed'));
      }
      return next();
    }
  };
};

module.exports = uploadMiddleware;
