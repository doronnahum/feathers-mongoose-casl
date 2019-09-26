
const { asyncForEach } = require('../../../utils/helpers');
const getSignFileInDocument = require('./getSignFileInDocument');

/**
 * @function singFileAfterPopulate
 * @description When you populate collection with protected files and you want to sign the
 * files before you send them to  client
 * @param {object} config
 * @param {object} config.path deep path to file object 'profile.image'
 * @param {object} config.fileKeyName default is 'file'
 * @param {string} config.singUrlKeyName default is 'file'
 * @param {string} config.singUrlKeyName default is 'file'
 */
const singFileAfterPopulate = function (config) {
  const {
    path,
    fileKeyName = 'file',
    singUrlKeyName = 'file'
  } = config;

  return async function (hook) {
    const isArray = !hook.result._id && Array.isArray(hook.result.data);

    if (isArray) {
      const data = [];
      await asyncForEach(hook.result.data, async function (docWithFile) {
        const docWithSignFile = await getSignFileInDocument({ doc: docWithFile, hook, path, fileKeyName, singUrlKeyName });
        data.push(docWithSignFile);
      });
      hook.dispatch = hook.result;
      hook.dispatch.data = data;
    } else {
      hook.dispatch = await getSignFileInDocument({ doc: hook.result, hook, path, fileKeyName, singUrlKeyName });
    }
    return hook;
  };
};

module.exports = singFileAfterPopulate;
