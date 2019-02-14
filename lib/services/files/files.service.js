// Initializes the `files` service on path `/files`

const createService = require('../../utils/createService');
// const {createService} = require('feathers-mongoose-casl');
const createModel = require('./files.model');
const hooks = require('./files.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
var FormData = require('form-data');
const { GeneralError } = require('@feathersjs/errors');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/files',
    // multipartMiddleware.single('file'),
    async function(req,res,next){
      console.log(4, req.params)
      if(req.file && typeof req.file === 'object'){ // If it a string then we didn't need to upload
        try {
          const uploadToStatic = true;
          const serviceName = uploadToStatic ? 'uploads-static' : 'static';
          const storageName = uploadToStatic ? 'static' : 's3';
          const upload = await app.service(serviceName).create({buffer: req.file});
          const serverUrl = app.get('serverUrl');
          if(upload && upload.id){
            req.body.file = uploadToStatic
              ? `${serverUrl}/uploads/${upload.id}`
              : `https://s3.amazonaws.com/${app.get('s3').bucket}/${upload.id}`;
            req.body.storage = storageName;
            req.body.fileId = upload.id;
            next();
          }else{
            throw new GeneralError('upload field');
          }
        } catch (error) {
          app.error(error);
          throw new GeneralError('upload field');
        }
      }else{
        req.body.storage = 'other';
        next();
      }
    },
    createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('files');

  service.hooks(hooks);
};
