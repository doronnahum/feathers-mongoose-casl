// Initializes the `uploads` service on path `/uploads`
const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');
const {GeneralError} = require('@feathersjs/errors');
const enums = require('../../enums');
const moment = require('moment')


module.exports = function (app) {
  
  // Initial s3
  const s3Config = app.get('s3');
  const s3 = new AWS.S3({
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey
  });
  
  // Initial google-cloud
  const googleConfig = app.get('google-cloud');
  const storage = new Storage({
    projectId: googleConfig.projectId,
    keyFilename: googleConfig.keyFilename,
  });
  const bucket = storage.bucket(googleConfig.bucket);
  
  app.use('/get-public-file-url',{
    async find(params) { // this here only to return a Promise
      const {storage, fileId} = params;
      // S3
      if(storage === enums.STORAGE_TYPES.s3){
        const url = s3.getSignedUrl('getObject', {
          Bucket: s3Config.bucket,
          Key: fileId,
          Expires: s3Config.signedUrlExpires
        });
        return Promise.resolve(url);
      }

      // Google-cloud
      if(storage === enums.STORAGE_TYPES['google-storage']){
        const file = bucket.file(fileId);
        const url = await file.getSignedUrl({
          action: 'read',
          expires: moment().add(googleConfig.signedUrlExpires, 'seconds').toISOString()
        });
        if(!url || !url[0]) {
          app.error('File not found at google storage', {fileId});
          throw new GeneralError();
        }
        return Promise.resolve(url[0]);
      }

      // Other
      if((!storage || storage === enums.STORAGE_TYPES.others) && params.file){
        return Promise.resolve(params.file);
      }


      throw new GeneralError();
    }
  });

};
