
const enums = require('../enums');
const { GeneralError } = require('@feathersjs/errors');



module.exports = function createUploadMiddleware({app, fileKeyName = 'file', uploadToStatic = false, serviceName, public = false}) {
  return async  function(req,res,next){
    const upload_serviceName = uploadToStatic ? enums.uploadServiceName.uploadsStatic : enums.uploadServiceName.uploads;
    const storageName = uploadToStatic ? enums.STORAGE_TYPES.static : enums.STORAGE_TYPES.s3;
    // GET
    if(req.method === 'GET') next();
    // DELETE
    if(req.method === 'DELETE') {
      try {
        const docId = req.params.__feathersId;
        const file = await app.service(serviceName).get(docId);
        if(file && file.storage !== enums.STORAGE_TYPES.others){
          // In this case we want to remove file from storage before remove document from DB
          app.service(upload_serviceName).remove(file.fileId);
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
            app.service(upload_serviceName).remove(currentDoc.fileId);
          }
        } catch (error) {
          app.error(`feathers-mongoose-casl - try to remove ${req.params.__feathersId} from storage failed, method: ` + req.method);
        }
      }
      //
      if(req[fileKeyName] && typeof req[fileKeyName] === 'object'){ // If it a string then we didn't need to upload
        try {
          const upload = await app.service(upload_serviceName).create({buffer: req[fileKeyName], [enums.uploadPublicFileKey]: public});
          const originalName = req[fileKeyName].originalname;
          const serverUrl = app.get('serverUrl');
          if(upload && upload.id){
            req.body[fileKeyName] = uploadToStatic
              ? `${serverUrl}/uploads/${upload.id}`
              : `https://s3.amazonaws.com/${app.get('s3').bucket}/${upload.id}`;
            req.body.storage = storageName;
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