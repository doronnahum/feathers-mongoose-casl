const enums = require('../../../enums');
const { GeneralError } = require('@feathersjs/errors');

const handleDelete = async function (params) {
  try {
    const { app, req, serviceName, uploadService } = params;
    /**
     * Find document data
    */
    const docId = req.params.__feathersId;
    const currentDoc = await app.service(serviceName).get(docId);
    if (currentDoc && currentDoc.storage !== enums.STORAGE_TYPES.others) {
      /**
       * Remove file from storage
       */
      await uploadService.remove(currentDoc.fileId);
    }
  } catch (error) {
    params.app.error(`feathers-mongoose-casl - try to remove ${params.req.params.__feathersId} from storage failed, method: ` + params.req.method);
    if (params.app.get('feathers-mongoose-casl').uploads.blockDeleteDocumentWhenDeleteFileFailed) {
      throw new GeneralError('Delete file is failed');
    }
  }
};

module.exports = handleDelete;
