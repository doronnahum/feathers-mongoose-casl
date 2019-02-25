// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const multer = require('multer');
const multipartMiddleware = multer();
const BlobService = require('feathers-blob');
const fs = require('fs-blob-store');
const AWS = require('aws-sdk');
const Store = require('s3-blob-store');
const {GeneralError, NotFound} = require('@feathersjs/errors');
const enums = require('../../enums');
const fileSystem = require('fs');
const path = require('path');
var serveStatic = require('serve-static')

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
  
  const blobStorage = fs(app.get('static')+'/uploads');
  // // Upload files to public/uploads folder
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
  app.use('/get-file',
    {
      async get(id) {
        const [serviceName, docId] = id.split('-');
        if(!serviceName || !docId) throw new GeneralError();
        const service = app.service(serviceName);
        if(!service) throw new GeneralError('service not found');
        const doc = await service.get(docId);
        if(doc){
          return Promise.resolve(doc);
        }else{
          throw new NotFound();
        }
      }
    },
    // serveStatic(path.join(app.get('static')+'/uploads/')),
    // function redirect(req, res, next) {
    //   // // res.data = res.sendFile());
    //   // var img = fs.readFileSync(path.join(app.get('static')+'/uploads/'+ '56c151c1c8854bfe0d6bf71ed0a6200c6856e6492597fabc6d16d42e6c2425ae.jpeg'));
    //   // res.writeHead(200, {'Content-Type': 'image/jpeg' });
    //   // res.end(img, 'binary');
    //   res.data.updateData = true;
    //   next();
    // }
    // function redirect(req, res, next) {
    //   const p = serveStatic(path.join(app.get('static')+'/uploads/'+res.data.fileId));
    //   p(req, res, next)
    //   return _serveStatic(req, res, () => {
    //     res.data = res.sendFile(path.join(app.get('static')+'/uploads/'+res.data.fileId));
    //     next();
    //   })
    //   // if(data){
    //   //   const {
    //   //     fileId, storage
    //   //   } = data;
    //   //   if(storage === enums.STORAGE_TYPES.static){
    //   //     // const p = serveStatic(path.join(__dirname, 'public'));
    //   //     // return p(req, res, next);
    //   //     res.data = res.sendFile(path.join(app.get('public'), 'index.html'));
    //   //     // next();
    //   //     // var filePath = path.join(app.get('public')+'/uploads'+ fileId);
    //   //     // var stat = fileSystem.statSync(filePath);
      
    //   //     // res.writeHead(200, {
    //   //     //   'Content-Type': 'image/jpeg',
    //   //     //   'Content-Length': stat.size
    //   //     // });
      
    //   //     // var readStream = fileSystem.createReadStream(filePath);
    //   //     // readStream.pipe(res);
    //   //     // next();
    //   //   }
    //   // }
    //   // return res.redirect(301, 'http://some-page.com');
    // }
  )


  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');
  const staticService = app.service('uploads-static');
  service.hooks(hooks);
  staticService.hooks(hooks);
};
