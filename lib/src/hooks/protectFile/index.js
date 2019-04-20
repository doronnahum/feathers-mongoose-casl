var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const enums = require('../../enums');

module.exports = function (serviceName, fileKey) {
  return function(hook) {
    const isNew = !hook.id;
    const docId = hook.id || new ObjectId();
    if(isNew){
      hook.data._id = docId;
    }
    if(hook.data.storage && hook.data.storage !== enums.STORAGE_TYPES.others){
      hook.data[fileKey] = `/get-file/n:${serviceName}&id:${docId.toString()}`;
    }
  };
};