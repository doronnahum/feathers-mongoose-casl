// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const BlobService = require('feathers-blob');
const fs = require('fs-blob-store');

module.exports = function (app) {
  // uploads to public folder
  // -------------------------------
  const blobStorage = fs(app.get('feathers-mongoose-casl').privateFolder+'/uploads');
  app.use('/upload-local-private',
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
  const staticService = app.service('upload-local-private');
  staticService.hooks(hooks);
};
