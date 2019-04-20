// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
const BlobService = require('feathers-blob');
const fs = require('fs-blob-store');

module.exports = function (app) {
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

  // Get our initialized service so that we can register hooks
  const staticService = app.service('uploads-static');
  staticService.hooks(hooks);
};
