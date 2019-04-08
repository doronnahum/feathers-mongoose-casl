
module.exports = function (fileKey) {
  return function(hook) {
    const host = hook.params && hook.params.headers && hook.params.headers.host;

    if(hook.result && hook.result.data){
      hook.result.data = hook.result.data.map(item => {
        item[fileKey] = `${host || ''}${item[fileKey]}`;
        return item;
      });
      return hook;
    }else if(hook.result && hook.result[fileKey]){
      hook.result[fileKey] = hook.result[fileKey].includes(host) ? hook.result[fileKey] : `${host || ''}${hook.result[fileKey]}`;
    }
  };
};