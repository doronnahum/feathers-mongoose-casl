const { Joi } = require('../../../lib/index');

const getJoiObject = function (withRequired) {
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    author: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'users',
      displayKey: 'email'
    })[required](),
    title: Joi.string().min(5)[required]().meta({
      dashboard: {
        label: 'Post title',
        inputProps: JSON.stringify({ style: { background: 'red' } })
      }
    }),
    body: Joi.string()[required](),
    rating: Joi.number().max(5).meta({
      dashboard: {
        hideOnUpdate: true,
        hideOnCreate: true,
      }
    }),
    image: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'files',
      displayKey: 'name'
    })
  });
};

module.exports = getJoiObject;