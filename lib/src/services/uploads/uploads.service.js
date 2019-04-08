// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
const BlobService = require('feathers-blob');
const fs = require('fs-blob-store');
const AWS = require('aws-sdk');
const Store = require('s3-blob-store');
const {GeneralError, NotFound} = require('@feathersjs/errors');
const feathersCache = require('@feathers-plus/cache');
const {callingParamsPersistUser} = require('../../utils/helpers');

const enums = require('../../enums');

const redirect = function (req, res, next) {
  if(res.data){
    return res.redirect(res.data.url);
  }else{
    next();
  }
};


module.exports = function (app) {
  
  const privateFilesCacheConfig = app.get('private-files-cache');
  const privateFilesCache = feathersCache(privateFilesCacheConfig['local-config']);
  // uploads to s3 service
  // -------------------------------
  // Upload files to AWS s3 - s3 new bucket guide https://github.com/keithweaver/python-aws-s3
  const s3 = new AWS.S3({
    accessKeyId: app.get('s3').accessKeyId,
    secretAccessKey: app.get('s3').secretAccessKey
  });
  
  const blobStore = Store({
    client: s3,
    bucket: app.get('s3').bucket
  });

  app.use('/uploads',
    multipartMiddleware.single('file'),
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    BlobService({
      Model: blobStore
    })
  );
  
  // uploads to public folder
  // -------------------------------
  const blobStorage = fs(app.get('public')+'/uploads');
  app.use('/uploads-static',
    multipartMiddleware.single('file'),
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    BlobService({Model: blobStorage}),
  );

  // handle download private files from s3
  // -------------------------------
  app.use('/get-file',{
    // eslint-disable-next-line no-unused-vars
    async get(id) { // this here only to return a Promise
      return Promise.resolve({});
    }},redirect);


  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');
  const staticService = app.service('uploads-static');
  const getFileService = app.service('get-file');
  getFileService.options = {
    skipAbilitiesCheck: true // this is public route
  };
  getFileService.hooks({
    before: {
      get: [async function(hook){
        const id = hook.id;
        const [serviceName, docId] = id.replace('n:', '').split('&id:');
        if(!serviceName || !docId) throw new GeneralError();
        const docService = app.service(serviceName);
        if(!docService) throw new GeneralError('service not found');
        let doc;
        const docFromCache = privateFilesCacheConfig.enabled && privateFilesCache.get(id);
        if(docFromCache){
          app.debug('feathers-mongoose-casl - get-fle service - return file document from privateFilesCache');
          doc = docFromCache;
        }else{
          doc = await docService.find(callingParamsPersistUser(hook,{
            '_id': docId
          }));
          doc = doc.data[0];
          if(!doc) throw new NotFound();
          privateFilesCache.set(id, {storage: doc.storage, fileId: doc.fileId});
        }
        if(doc){
          const {storage, fileId} = doc;
          if(storage === enums.STORAGE_TYPES.s3){
            const signedUrlExpireSeconds = app.get('s3').signedUrlExpireSeconds;
            const url = s3.getSignedUrl('getObject', {
              Bucket: app.get('s3').bucket,
              Key: fileId,
              Expires: signedUrlExpireSeconds
            });
            hook.result = {url};
          }else{
            throw new NotFound();
          }
        }else{
          throw new NotFound();
        }
      }]
    }});
  service.hooks(hooks);
  staticService.hooks(hooks);

  app.use('/get-public-file-url',{
    async find(params) { // this here only to return a Promise
      const {storage, fileId} = params;
      if(storage === enums.STORAGE_TYPES.s3){
        const signedUrlExpireSeconds = app.get('s3').signedUrlExpireSeconds;
        const url = s3.getSignedUrl('getObject', {
          Bucket: app.get('s3').bucket,
          Key: fileId,
          Expires: signedUrlExpireSeconds
        });
        return Promise.resolve(url);
      }
      throw new GeneralError();
    }
  });
};
