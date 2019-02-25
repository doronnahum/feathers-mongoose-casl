// const {Joi, enums} = require('feathers-mongoose-casl');
const Joi = require('../../utils/joi');
const enums = require('../../enums');

const getJoiObject = function(withRequired) {
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    // Data from user
    name: Joi.string(),
    file: Joi.string().meta({ dashboard: { inputType: 'file' } }),
    type: Joi.string(),
    info: Joi.string(),
    // Data from upload service
    fileId: Joi.string().meta({ dashboard: { readOnly: true } }),
    storage: Joi.string().meta({ dashboard: { readOnly: true } }).valid(
      enums.STORAGE_TYPES.s3,
      enums.STORAGE_TYPES.static,
      enums.STORAGE_TYPES.others
    ) .meta({ dashboard: { readOnly: true  } }),
    uploadChannel: Joi.string()
      .valid('site', 'back-office', 'app')
      .meta({ dashboard: { readOnly: true, initialValue: 'back-office' } }),
    user: Joi.objectId()
      .meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' })
      .meta({ dashboard: { readOnly: true } })
  });
};

module.exports = getJoiObject;
