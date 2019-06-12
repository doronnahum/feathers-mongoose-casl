const {asyncForEach} = require('../../utils/helpers');
const {STORAGE_TYPES} = require('../../enums');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

const LOCAL_STORAGE = [STORAGE_TYPES['local-private'], STORAGE_TYPES['local-public']];
module.exports = function ({
  serviceName = 'files',
  fileKeyName = 'file',
  singUrlKeyName = 'file',
  protectTheFile = true,
  autoSignUrl = true,
  userKeyName= 'user'
}) {
  return async function(hook){
    const {method, type} = hook;
    /*
    *
    * BEFORE
    * 
    */
    if(type === 'before'){
      if(protectTheFile && ['create','update','patch'].includes(method)){
        // We want to replace file url with get-file service that return url to client only when the user able to read the relevant doc
        const isNew = !hook.id;
        const docId = hook.id || new ObjectId();
        if(isNew){
          hook.data._id = docId;
        }
        if(hook.data.storage && (hook.data.storage !== STORAGE_TYPES.others && hook.data.storage !== STORAGE_TYPES['local-public'])){
          hook.data[fileKeyName] = `/get-file/n:${serviceName}&id:${docId.toString()}`; // This is the string that will be saved in DB
        }
      }
      if(method === 'create'){
				// We want to assign user to data if needed
				hook.data = hook.data || {};
        hook.data[userKeyName] = hook.data[userKeyName] || (hook.params.user && hook.params.user._id);
      }
      return hook;
    }
    /*
    *
    * AFTER
    * 
    */
    if(type === 'after'){
      if(method !== 'remove'){
        // autoSignUrl = We want to return a sign url to client
        const isArray = Array.isArray(hook.result.data);
        const serverUrl = hook.app.get('serverUrl');
        if(isArray){
          const dataWithPublicFileUrl = [];
          await asyncForEach(hook.result.data, async function(item){
            if(!item.storage || item.storage === STORAGE_TYPES['others'] || item.storage === STORAGE_TYPES['local-public']) {
              dataWithPublicFileUrl.push(item);
            }else{
              if(autoSignUrl && !LOCAL_STORAGE.includes(item.storage)){
                try {
                  item[singUrlKeyName] = await hook.app.service('get-public-file-url').find({fileId: item.fileId, storage: item.storage, file: item.file});
                } catch (error) {
                  hook.app.error('feathers-mongoose-casl - uploadsHooks error when try to get-public-file-url ', error);                
                }
              }else{
                const isUrlWithServerPrefix = item[fileKeyName].includes(serverUrl);
                if(!isUrlWithServerPrefix){
                  item[fileKeyName] = `${serverUrl || ''}${item[fileKeyName]}`;
                }
              }
              dataWithPublicFileUrl.push(item);
            }
          });
          // hook.result.data = dataWithPublicFileUrl;
          hook.dispatch = Object.assign({}, hook.result, {data: dataWithPublicFileUrl});
        }else{
          const item =  Object.assign({}, hook.result);
          
          if(!item.storage || item.storage === STORAGE_TYPES['others'] || item.storage === STORAGE_TYPES['local-public']){
            return hook;
          }else{
            if(autoSignUrl && [item.storage] !== STORAGE_TYPES['local-private']){
              try {
                item[singUrlKeyName] = await hook.app.service('get-public-file-url').find({fileId: item.fileId, storage: item.storage, file: item.file});
              } catch (error) {
                hook.app.error('feathers-mongoose-casl - uploadsHooks error when try to get-public-file-url ', error);                
              }
            }else{
              const isUrlWithServerPrefix = item[fileKeyName].includes(serverUrl);
              if(!isUrlWithServerPrefix){
                item[fileKeyName] = `${serverUrl || ''}${item[fileKeyName]}`;
              }
            }
          }
          hook.dispatch = item;
        }
      }
      return hook;
    }
  };
};