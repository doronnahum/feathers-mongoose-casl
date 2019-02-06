
const dauria = require('dauria');
const { GeneralError } = require('@feathersjs/errors');
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      function(context) {
        if(!context.data.uri && !context.params.file){
          throw new GeneralError('file or uri is required');
        }
        if(context.path === 'uploads'){
          context.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
        }
        if (!context.data.uri && context.params.file){
          const file = context.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          context.data = {uri: uri};
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [async function(context) {
      const path = context.path;
      const uploadToS3 = path === 'uploads';
      const fileId = context.result.id;
      const serverUrl = context.app.get('serverUrl');
      const url = uploadToS3
        ? `https://s3.amazonaws.com/${context.app.get('s3').bucket}/${fileId}`
        : `${serverUrl}/uploads/${fileId}`;
      let storage = uploadToS3 ? 's3' : 'static';
      
      // Save file document and return result to client
      const file = await context.app.service('files').create({
        fileId,
        url: url,
        user: context.params.user._id,
        storage: storage
      });
      context.result = file;
      return context;
    }],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
