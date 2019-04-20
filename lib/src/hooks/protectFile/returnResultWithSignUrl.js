const {asyncForEach} = require('../../utils/helpers');

module.exports = function ({targetSignUrlKey = 'url'}) {
  return async function(hook){
    const isArray = Array.isArray(hook.result.data);
    if(isArray){
      const dataWithPublicFileUrl = [];
      await asyncForEach(hook.result.data, async function(item){
        item[targetSignUrlKey] = await hook.app.service('get-public-file-url').find({fileId: item.fileId, storage: item.storage, file: item.file});
        dataWithPublicFileUrl.push(item);
      });
      hook.result.data = dataWithPublicFileUrl;
    }else{
      const item = hook.result;
      const signUrl = await hook.app.service('get-public-file-url').find({fileId: item.fileId, storage: item.storage, file: item.file});
      hook.result[targetSignUrlKey] = signUrl;
    }
  };
};