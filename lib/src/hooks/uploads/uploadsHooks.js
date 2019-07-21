
const getSignFile = require('./getSignFile');
const { asyncForEach } = require('../../utils/helpers');

module.exports = function (config) {
  const {
    fileKeyName = 'file',
    userKeyName= 'user',
    public,
    singUrlKeyName= 'file'
  } = config;

  if(config.protectTheFile){
    throw new Error('Feathers-mongoose-casl-uploadsHooks -please stop using protectTheFile , use public instead');
  }

  return async function (hook) {
    const { type, method } = hook;
    
    /**
     * before
     * --------------------------------------------------------------------------------
     * We want to assign the user from params to the document data on create/update
     * --------------------------------------------------------------------------------
     */
    if(type === 'before' && ['create','patch','update'].includes(method)){
      const isArray = Array.isArray(hook.data);
      if(isArray){
        hook.data = hook.data.map(doc => {
          doc[userKeyName] = hook.params.user._id;
          return doc;
        });
      }else{
        hook.data[userKeyName] = hook.params.user._id;
      }

      return hook;
    }
    
    /**
     * after
     * --------------------------------------------------------------------------------
     * When file is private we have 2 options base the hook config,
     * When autoSignUrl is true Need to sign the file and send the client a sign url
     * and when it false we need to replace the file url with url to 'get-file' service 
     * --------------------------------------------------------------------------------
     */
    if (type === 'after') {
      let data;

      if(!public){
        const isArray = !hook.result._id && Array.isArray(hook.result.data);
        if(isArray){
          data = [];
          await asyncForEach(hook.result.data, async function(item){
            const url = await getSignFile({item, fileKeyName, hook});
            const _item = Object.assign({}, item);
            _item[singUrlKeyName] = url;
            data.push(_item);
          });
        }else{
          data = Object.assign({}, hook.result);
          data[singUrlKeyName] = await getSignFile({item:  hook.result, fileKeyName, hook}); 
        }

        if(isArray){
          hook.dispatch = hook.result;
          hook.result.data = data;
        }else{
          hook.result = data;
        }

      }

  
    }
    return hook;
  };
};
