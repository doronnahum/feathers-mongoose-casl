var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = function (serviceName, fileKey) {
  return function(hook) {
    const serverUrl = hook.app.get('serverUrl');
    hook.data._id = new ObjectId();
    hook.data[fileKey] = `${serverUrl}/get-file/${serviceName}-${hook.data._id.toString()}`;
  };
};