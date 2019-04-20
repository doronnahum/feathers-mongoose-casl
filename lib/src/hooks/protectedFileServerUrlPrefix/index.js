
const enums = require('../../enums');

module.exports = function (fileKey) {
  return function(hook) {
    const host = hook.params && hook.params.headers && hook.params.headers.host;

    if(hook.result && hook.result.data){
      hook.result.data = hook.result.data.map(item => {
        if(!item[fileKey] || !item.storage || item.storage === enums.STORAGE_TYPES.others) return item;
        item[fileKey] = item[fileKey].includes(host)// TODO - why sometimes the file URL came with his prefix twice
          ? item[fileKey]
          : `${host || ''}${item[fileKey]}`;
        return item;
      });
      return hook;
    }else if(hook.result && hook.result[fileKey]){
      if(!hook.result[fileKey] || !hook.result.storage || hook.result.storage === enums.STORAGE_TYPES.others) return hook;
      hook.result[fileKey] =
        hook.result[fileKey].includes(host) // TODO - why sometimes the file URL came with his prefix twice
          ? hook.result[fileKey]
          : `${host || ''}${hook.result[fileKey]}`;
    }
  };
};