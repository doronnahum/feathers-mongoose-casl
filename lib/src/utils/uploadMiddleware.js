
const enums = require('../enums');
const STORAGE_TYPES = enums.STORAGE_TYPES;
const { GeneralError } = require('@feathersjs/errors');
const multer = require('multer');
const multipartMiddleware = multer();
const uuidv4 = require('uuid/v4');

const upload_serviceName_by_storage_types = {
  [STORAGE_TYPES['local-private']]: 'upload-local-private',
  [STORAGE_TYPES['local-public']]: 'upload-local-public',
  [STORAGE_TYPES.s3]: 'uploads-s3',
  [STORAGE_TYPES['google-cloud']]: 'uploads-google',
};

/**
 * @function getFileUrl
 * Build full url by the storage type,
 * when the storage is local we use get-file without serverUrl, in this way we can support the DB even if server url is changed
 * @param {object} payload 
 * @param {object} payload.app
 * @param {string} payload.storageService // storageService name, oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {string} payload.fileId // file id in storage service
 */
const getFileUrl = function(payload){
  const {
    app,
    storageService,
    fileId
  } = payload;
  if(storageService === STORAGE_TYPES['local-private']){
    return `${app.get('privateFiles')}/uploads/${fileId}`;
  }
  if(storageService === STORAGE_TYPES['local-public']){
    return `${app.get('serverUrl')}/uploads/${fileId}`;
  }
  if(storageService === STORAGE_TYPES.s3){
    return `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
  }
  if(storageService === STORAGE_TYPES['google-cloud']){
    return `https://storage.googleapis.com/${app.get('google-cloud').bucket}/${fileId}`;
  }
};

/**
 * @function getFileFromRequest
 * Use multer as async/await inside express middleware
 * @param {*} req 
 * @param {*} res 
 * @param {*} fileKeyName 
 */
const getFileFromRequest = function(req, res, fileKeyName) {
  return new Promise((resolve) => {
    multipartMiddleware.single(fileKeyName)(req,res,resolve);
  });
};

/**
 * @function uploadMiddleware
 * @param {object} payload
 * @param {object} payload.app
 * @param {string} payload.fileKeyName // The field name of the file, default is 'file'
 * @param {string} payload.serviceName // The service name
 * @param {string} payload.storageService // oneOf: ['local-private','local-public','s3','google-cloud'] 
 * @param {string} payload.publicAcl // set true if you want the file to be public
 * 
 */
const uploadMiddleware = function (payload) {
  const {
    app,
    fileKeyName = 'file',
    serviceName,
    storageService,
    publicAcl = false
  } = payload;
  return async  function(req,res,next){
    if(req.method === 'GET') next(); // This middleware didn't relevant on GET
    const upload_serviceName = upload_serviceName_by_storage_types[storageService]; // for example - 's3' will be 'uploads-s3'
    if(!upload_serviceName) {
      throw new Error('feathers-mongoose-casl - uploadMiddleware - storageService need to be onOf ' + Object.keys(upload_serviceName_by_storage_types).join(','));
    }

    /*
    *
    * DELETE
    * We want to delete the file from storage before we deleting the document
    * 
    */
    if(req.method === 'DELETE') {
      try {
        const docId = req.params.__feathersId;
        const currentDoc = await app.service(serviceName).get(docId);
        if(currentDoc && currentDoc.storage !== enums.STORAGE_TYPES.others){
          // In this case we want to remove file from storage before remove document from DB
          const currentFileServiceName = upload_serviceName_by_storage_types[currentDoc.storage];
          app.service(currentFileServiceName).remove(currentDoc.fileId);
          next();
        }
      }
      catch (error) {
        app.error(`feathers-mongoose-casl - try to remove ${req.params.__feathersId} from storage failed, method: ` + req.method);
        if(app.get('feathers-mongoose-casl').uploads.blockDeleteDocumentWhenDeleteFileFailed){
          throw new GeneralError('Delete file is failed');
        }else{
          next();
        }
      }
    }

    /*
    *
    * UPDATE 
    * We want to delete the file from storage before we replacing the file in the document
    * 
    */
    if(['PATCH', 'PUT'].includes(req.method) && req[fileKeyName]){
      try {
        // in this case we want to delete the old file from the storage
        const docId = req.params.__feathersId;
        const currentDoc = await app.service(serviceName).get(docId);
        if(currentDoc && currentDoc.storage !== enums.STORAGE_TYPES.others){
          const currentFileServiceName = upload_serviceName_by_storage_types[currentDoc.storage];
          app.service(currentFileServiceName).remove(currentDoc.fileId);
        }
      } catch (error) {
        app.error(`feathers-mongoose-casl - try to remove ${req.params.__feathersId} from storage failed, method: ` + req.method);
        if(app.get('feathers-mongoose-casl').uploads.blockUpdateDocumentWhenReplaceFileFailed){
          throw new GeneralError('Delete the previous file is failed');
        }
      }
    }

    /*
    * When request includes file, we need to upload the file,
    * but if the file is string then we just add storage that equal to 'others'
    * 
    */
    if(['POST', 'PATCH', 'PUT'].includes(req.method)){
      await getFileFromRequest(req,res, fileKeyName); // async  multer
      if(req[fileKeyName] && typeof req[fileKeyName] === 'object'){ // If it a string then we didn't need to upload
        try {
          const originalName = req[fileKeyName].originalname;
          const fileId = uuidv4() + '--' + originalName;
          const upload = await app.service(upload_serviceName).create({fileId, buffer: req[fileKeyName], [enums.uploadPublicFileKey]: publicAcl});
          if(upload && upload.id){
            req.body[fileKeyName] = getFileUrl({
              app,
              fileId: upload.id,
              storageService
            });
            req.body.storage = storageService;
            req.body.fileId = upload.id;
            req.body.originalName = originalName;
            next();
          }else{
            throw new GeneralError('upload field');
          }
        } catch (error) {
          app.error(error);
          throw new GeneralError('upload field');
        }
      }else{
        if(req[fileKeyName] && typeof req[fileKeyName] === 'string'){
          req.body.storage = enums.STORAGE_TYPES.others; // ile is string then we just add storage that equal to 'others'
        }
        next();
      }
    }
  };
};

module.exports = uploadMiddleware;