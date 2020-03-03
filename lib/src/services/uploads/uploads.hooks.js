
const dauria = require('dauria');
const { GeneralError } = require('@feathersjs/errors');
const { disallow } = require('feathers-hooks-common');
const { UPLOAD_PUBLIC_FILE_KEY } = require('../../enums');

// feathers-mongoose-casl
// ------------------------
const authenticate = require('../../hooks/authenticate');
const validateAbilities = require('../../hooks/abilities');
const validateSchema = require('../../hooks/validateSchema');
const sanitizedData = require('../../hooks/sanitizedData');
// //un comment to copy to your src folder
// const validateSchema = require('feathers-mongoose-casl/lib/src/hooks/validateSchema');
// const authenticate = require('feathers-mongoose-casl/lib/src/hooks/authenticate');
// const validateAbilities = require('feathers-mongoose-casl/lib/src/hooks/abilities');
// const sanitizedData = require('feathers-mongoose-casl/lib/src/hooks/sanitizedData');

module.exports = {
  before: {
    all: [authenticate, validateAbilities, disallow('external')],
    find: [],
    get: [],
    create: [validateSchema,
      function (context) {
        if (context.data[UPLOAD_PUBLIC_FILE_KEY]) {
          // Make the file public
          if (context.path === 'uploads-s3') {
            context.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
          }
          if (context.path === 'uploads-google') {
            context.params[UPLOAD_PUBLIC_FILE_KEY] = true;
          }
        }
        if (context.path !== 'uploads-google') {
          if (context.data.buffer) {
            const uri = dauria.getBase64DataURI(context.data.buffer.buffer, context.data.buffer.mimetype);
            context.data = {
              uri: uri,
              mimetype: context.data.buffer.mimetype,
              id: context.data.fileId
            };
          } else if (!context.data.uri && !context.params.file) {
            throw new GeneralError('file or uri is required');
          } else if (!context.data.uri && context.params.file) {
            const file = context.params.file;
            const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
            context.data = {
              uri: uri,
              mimetype: file.mimetype,
              id: context.data.fileId
            };
          }
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [sanitizedData],
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
