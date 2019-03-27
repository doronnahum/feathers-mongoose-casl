


// feathers-mongoose-casl
const Joi = require('../../utils/joi');
const enums = require('../../enums');
// //un comment to copy to your src folder
// const {Joi, enums} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired) {
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    // Data from user
    name: Joi.string(),
    file: Joi.string().meta({ dashboard: { doc: {inputType: 'file'}, list: {type: 'link'} } })[required](),
    type: Joi.string(),
    info: Joi.string(),
    // Data from upload service
    fileId: Joi.string().meta({ dashboard: { doc: {readOnly: true }} }),
    storage: Joi.string().meta({ dashboard: { doc: {readOnly: true }} }).valid(
      enums.STORAGE_TYPES.s3,
      enums.STORAGE_TYPES.static,
      enums.STORAGE_TYPES.others
    ) .meta({ dashboard: { doc: {readOnly: true  }} }),
    uploadChannel: Joi.string()
      .valid('site', 'back-office', 'app')
      .meta({ dashboard: { doc: {readOnly: true, initialValue: 'back-office' }} }),
    user: Joi.objectId()
      .meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' })
      .meta({ dashboard: { doc: {readOnly: true} } })
  });
};

module.exports = getJoiObject;
