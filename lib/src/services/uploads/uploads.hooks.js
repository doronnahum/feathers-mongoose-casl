
const dauria = require('dauria');
const { GeneralError } = require('@feathersjs/errors');
const { disallow } = require('feathers-hooks-common');
const enums = require('../../enums');

module.exports = {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [
      function(context) {
        if(context.path === enums.uploadServiceName.uploads && context.data[enums.uploadPublicFileKey]){
          context.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
        }
        if(context.data.buffer){
          const uri = dauria.getBase64DataURI(context.data.buffer.buffer, context.data.buffer.mimetype);
          context.data = {uri: uri};
        }
        else if(!context.data.uri && !context.params.file){
          throw new GeneralError('file or uri is required');
        }
        else if (!context.data.uri && context.params.file){
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
    create: [],
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
