const enums = require('../../../enums');
const { GeneralError } = require('@feathersjs/errors');

const handleUpdate = async function (params) {
  const { app, req, serviceName, uploadService } = params;
  try {
    // in this case we want to delete the old file from the storage
    const docId = req.params.__feathersId;
    const currentDoc = await app.service(serviceName).get(docId);
    if (currentDoc && currentDoc.storage !== enums.STORAGE_TYPES.others) {
      await uploadService.remove(currentDoc.fileId);
    }
  } catch (error) {
    /**
     * Remove file from storage failed
     * --------------------------------------------------------------------------------
     * In this case we want to throw an error only when
     * uploads.blockUpdateDocumentWhenReplaceFileFailed in the feathers-mongoose-casl config is true
     * when it false we continue and allow to delete the DB document
     * --------------------------------------------------------------------------------
     */
    app.error(`feathers-mongoose-casl - try to remove ${req.params.__feathersId} from storage failed, method: ` + req.method);
    if (app.get('feathers-mongoose-casl').uploads.blockUpdateDocumentWhenReplaceFileFailed) {
      throw new GeneralError('Delete the previous file is failed');
    }
  }
};

module.exports = handleUpdate;
