
const enums = require('../enums');
const STORAGE_TYPES = enums.STORAGE_TYPES;
const { GeneralError } = require('@feathersjs/errors');
/*
      app,
      fileKeyName: FILE_KEY_NAME,
      serviceName: 'files',
      storageService: STORAGE_TYPES.s3,
      publicAcl: false
*/

const upload_serviceName_by_storage_types = {
  [STORAGE_TYPES.static]: 'uploads-static',
  [STORAGE_TYPES.s3]: 'uploads-s3',
  [STORAGE_TYPES['google-storage']]: 'uploads-google',
};

const getFileUrl = function({
  app,
  fileId,
  storageService
}){
  const serverUrl = app.get('serverUrl');
  if(storageService === STORAGE_TYPES.static){
    return `${serverUrl}/uploads/${fileId}`;
  }
  if(storageService === STORAGE_TYPES.s3){
    return `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
  }
  if(storageService === STORAGE_TYPES['google-storage']){
    return `https://storage.googleapis.com/${app.get('google-cloud').bucket}/${fileId}`;
  }
};

module.exports = function createUploadMiddleware({
  app,
  fileKeyName = 'file',
  storageService,
  serviceName,
  publicAcl = false
}) {
  return async  function(req,res,next){
    
    const upload_serviceName = upload_serviceName_by_storage_types[storageService];
    if(!upload_serviceName) throw new Error('feathers-mongoose-casl - createUploadMiddleware - storageService need to be onOf ' + Object.keys(upload_serviceName_by_storage_types).join(','))
    // GET
    if(req.method === 'GET') next();
    // DELETE
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
        // throw new GeneralError(error);
      }
    }
    // POST
    if(['POST', 'PATCH', 'PUT'].includes(req.method)){
      // 'PATCH', 'PUT'
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
        }
      }
      //
      if(req[fileKeyName] && typeof req[fileKeyName] === 'object'){ // If it a string then we didn't need to upload
        try {
          const upload = await app.service(upload_serviceName).create({buffer: req[fileKeyName], [enums.uploadPublicFileKey]: publicAcl});;
          const originalName = req[fileKeyName].originalname;
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
          req.body.storage = enums.STORAGE_TYPES.others;
        }
        next();
      }
    }
  };
};