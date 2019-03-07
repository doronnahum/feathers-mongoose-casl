var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function (serviceName, fileKey) {
  return function(hook) {
    const serverUrl = hook.app.get('serverUrl');
    const isNew = !hook.id;
    const docId = hook.id || new ObjectId();
    if(isNew){
      hook.data._id = docId;
    }
    hook.data[fileKey] = `${serverUrl}/get-file/${serviceName}-${docId.toString()}`;
  };
};