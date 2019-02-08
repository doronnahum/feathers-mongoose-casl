const m2s = require('mongoose-to-swagger');

module.exports = function(Model, example = {}) {
  const regularSwaggerModel = m2s(Model);
  const parameters = {
    name: 'body',
    in: 'body',
    schema: {
      type: 'object',
      properties: {}
    },
    example: {}
  };

  Object.keys(regularSwaggerModel.properties).forEach(key => {
    if (['__v', 'createdAt', 'updatedAt', '_id'].includes(key)) return;
    const item = regularSwaggerModel.properties[key];
    parameters.schema.properties[key] = {
      type: item.type,
      example: example[key] || item.type,
      properties: item.properties
    };
  });

  return {
    create: {
      parameters: [parameters]
    },
    update: {
      parameters: [
        {
          name: '_id',
          in: 'path',
          schema: {
            type: String
          }
        },
        parameters
      ]
    }
  };
};
