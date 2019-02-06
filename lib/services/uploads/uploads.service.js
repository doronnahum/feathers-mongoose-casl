// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
const BlobService = require('feathers-blob');
const fs = require('fs-blob-store');
const AWS = require('aws-sdk');
const Store = require('s3-blob-store');


module.exports = function (app) {

  // Upload files to AWS s3 - s3 new bucket guide https://github.com/keithweaver/python-aws-s3
  const s3 = new AWS.S3({
    accessKeyId: app.get('s3').accessKeyId,
    secretAccessKey: app.get('s3').secretAccessKey
  });

  const blobStore = Store({
    client: s3,
    bucket: app.get('s3').bucket
  });
  
  const blobStorage = fs(app.get('public')+'/uploads');
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

  // // Upload files to public/uploads folder
  app.use('/uploads-static',
    multipartMiddleware.single('file'),
    function(req,res,next){
      req.feathers.file = req.file;
      next();
    },
    BlobService({Model: blobStorage})
  );


  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');
  const staticService = app.service('uploads-static');
  service.hooks(hooks);
  staticService.hooks(hooks);
};
