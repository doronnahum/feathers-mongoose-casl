// Remove from v2.0- this work only with cookies

// // Initializes the `uploads` service on path `/uploads`
// const { GeneralError, NotFound, Forbidden } = require('@feathersjs/errors');
// const feathersCache = require('@feathers-plus/cache');
// const { callingParamsPersistUser } = require('../../utils/helpers');
// var path = require('path');
// var mime = require('mime');
// var fs = require('fs');
// const debug = require('debug')('feathers-mongoose-casl');

// const redirect = function (req, res, next) {
//   if (res.data) {
//     if (res.data.url.download) {
//       var file = res.data.url.download;

//       var filename = path.basename(file);
//       var mimetype = mime.lookup(file);

//       var exists = fs.existsSync(file);
//       if (!exists) {
//         throw new NotFound();
//       } else {
//         res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//         res.setHeader('Content-type', mimetype);
//         var filestream = fs.createReadStream(file);
//         filestream.pipe(res);
//         return res.download(file);
//       }
//     } else if (res.data.url.public) {
//       next();
//     } else {
//       return res.redirect(res.data.url);
//     }
//   } else {
//     next();
//   }
// };

// const getDoc = async function ({ app, hook, docId, serviceName }) {
//   let doc;
//   const user = hook.params.user;
//   const idCachePrefix = user ? user._id : '';
//   const id = hook.id;
//   const docService = app.service(serviceName);
//   const privateFilesCacheConfig = app.get('feathers-mongoose-casl').privateFilesAbilityCache;
//   let docFromCache;
//   let privateFilesCache;
//   if (privateFilesCacheConfig && privateFilesCacheConfig.enabled) {
//     privateFilesCache = feathersCache(privateFilesCacheConfig['local-config']);
//     docFromCache = privateFilesCache.get(`${idCachePrefix}-${id}`);
//   }
//   if (docFromCache) {
//     debug('get-fle service - return file document from privateFilesCache');
//     doc = docFromCache;
//   } else {
//     doc = await docService.find(callingParamsPersistUser(hook, {
//       query: { '_id': docId }
//     }));
//     doc = doc.data[0];
//     if (!doc) {
//       const findWithFullAccess = await docService.find({ query:
//               { '_id': docId }
//       });
//       if (findWithFullAccess.total === 1) {
//         debug('upload service- File not found');
//         throw new NotFound('File not found');
//       } else {
//         debug('upload service- block get file access');
//         throw new Forbidden('You are not allowed to get this file');
//       }
//     }
//     debug('upload service- set file in cache');
//     if (privateFilesCache && privateFilesCacheConfig.enabled) {
//       privateFilesCache.set(`${idCachePrefix}-${id}`, { storage: doc.storage, fileId: doc.fileId, file: doc.file });
//     }
//   }
//   return doc;
// };

// module.exports = function (app) {
//   // Install check
//   const privateFilesCacheConfig = app.get('feathers-mongoose-casl').privateFilesAbilityCache;
//   if (!privateFilesCacheConfig) {
//     app.info('feathers-mongoose-casl missing privateFilesAbilityCache at config file, use file cache for better perfoamcne');
//   }
//   // Install check end
//   app.use('/get-file', {
//     // eslint-disable-next-line no-unused-vars
//     async get (id) { // this here only to return a Promise
//       return Promise.resolve({});
//     } }, redirect);

//   const getFileService = app.service('get-file');
//   getFileService.options = {
//     skipAbilitiesCheck: true // this is public route
//   };
//   getFileService.hooks({
//     before: {
//       get: [async function (hook) {
//         const id = hook.id;
//         const [serviceName, docId] = id.replace('n:', '').split('&id:');
//         if (!serviceName || !docId) {
//           hook.app.error('feathers-mongoose-casl - get-file - missing serviceName or docId in the url');
//           throw new GeneralError();
//         }
//         const docService = app.service(serviceName);
//         if (!docService) {
//           hook.app.error('feathers-mongoose-casl - get-file - missing service not found');
//           throw new GeneralError('service not found');
//         }
//         let doc = await getDoc({ app, serviceName, docId, hook });
//         const { storage, fileId } = doc;
//         const publicUrl = await app.service('get-public-file-url').find({ storage, fileId, file: doc.file });
//         hook.result = { url: publicUrl };
//       }]
//     } });
// };
