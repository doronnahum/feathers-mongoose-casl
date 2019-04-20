// Initializes the `uploads` service on path `/uploads`

const uploadsS3 = require('./uploads-s3.service');
const uploadsGoogle = require('./uploads-google.service');
const getFileService = require('./get-file.service');
const getPublicFileService = require('./get-public-file-url.service');
const uploadsStaticFileService = require('./uploads-static.service');


module.exports = function (app) {
  app.configure(uploadsS3);
  app.configure(uploadsGoogle);
  app.configure(getFileService);
  app.configure(getPublicFileService);
  app.configure(uploadsStaticFileService);
};
