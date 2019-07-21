// Initializes the `uploads` service on path `/uploads`

const uploadsS3 = require('./uploads-s3.service');
const uploadsGoogle = require('./uploads-google.service');
// const getFileService = require('./get-file.service'); // Remove from v2.0- this work only with cookies
const getPublicFileService = require('./get-public-file-url.service');
const uploadsLocalPrivateFileService = require('./upload-local-private.service');
const uploadsLocalPublicFileService = require('./upload-local-public.service');

module.exports = function (app) {
  // app.configure(getFileService); // Remove from v2.0- this work only with cookies
  app.configure(getPublicFileService);
  const uploadsToAllow = app.get('feathers-mongoose-casl').uploads.services;
  if (uploadsToAllow['s3']) app.configure(uploadsS3);
  if (uploadsToAllow['google-cloud']) app.configure(uploadsGoogle);
  if (uploadsToAllow['local-private']) app.configure(uploadsLocalPrivateFileService);
  if (uploadsToAllow['local-public']) app.configure(uploadsLocalPublicFileService);
};
