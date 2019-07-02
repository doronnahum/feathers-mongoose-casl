// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const BlobService = require('feathers-blob');
const AWS = require('aws-sdk');
const Store = require('s3-blob-store');

module.exports = function (app) {
  if (app.get('s3') && app.get('s3').accessKeyId) {
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

    app.use('/uploads-s3',
      BlobService({
        Model: blobStore
      })
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('uploads-s3');

    service.hooks(hooks);
  }
};
