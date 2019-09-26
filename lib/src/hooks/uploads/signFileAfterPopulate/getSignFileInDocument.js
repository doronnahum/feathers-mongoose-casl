
const getSignFile = require('../getSignFile');
const { asyncForEach } = require('../../../utils/helpers');
const _get = require('lodash/get');
const _set = require('lodash/set');

const validateFileField = function (fileField, fileKeyName) {
  if (!fileField || !fileField._id || !fileField.storage || !fileField.fileId || !fileField[fileKeyName]) {
    return false;
  }
  return true;
};

const getSignFileInDocument = async function ({ doc, hook, path, fileKeyName, singUrlKeyName }) {
  const _doc = Object.assign({}, doc);
  const fileField = _get(_doc, path);
  const populateArray = Array.isArray(fileField);
  /**
       * populate Array field
       * --------------------------------------------------------------------------------
       * When we populate array fields of files we need to sign each one of them
       * --------------------------------------------------------------------------------
       */
  if (populateArray) {
    const fileItems = _get(_doc, path); // [{id: '..', [fileKeyName]},{...}]
    const data = [];
    await asyncForEach(fileItems, async function (fileItem) {
      const isValidFile = validateFileField(fileItem, fileKeyName);
      if (isValidFile) {
        const url = await getSignFile({ item: fileItem, fileKeyName, hook });
        fileItem[singUrlKeyName] = url;
      }
      data.push(fileItem);
    });
    _set(_doc, path, data);
  } else {
    /**
       * populate Object field
       * --------------------------------------------------------------------------------
       * When we populate object field we need to sign only one file
       * --------------------------------------------------------------------------------
       */
    const isValidFile = validateFileField(fileField, fileKeyName);
    if (isValidFile) {
      const url = await getSignFile({ item: fileField, fileKeyName, hook });
      _set(_doc, `${path}.${singUrlKeyName}`, url);
    }
  }

  return _doc;
};

module.exports = getSignFileInDocument;
