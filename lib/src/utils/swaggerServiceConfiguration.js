/**
 * @function swaggerServiceConfiguration
 * @param {object} config
 * @param {object} config.app
 * @param {string} config.serviceName
 * @param {string} config.postDescription
 * @param {object} config.postExample //  { type: 'object', example: {name: 'string'} }
 */
const swaggerServiceConfiguration = function (config) {
  const {
    app,
    serviceName,
    postDescription,
    postExample
  } = config;
  if (!app || !serviceName) {
    throw new Error('swaggerServiceConfiguration - missing app and serviceName');
  }
  if (!app.docs || !app.docs.paths) {
    app.error('swaggerServiceConfiguration swagger configuration issue');
    return;
  }
  const path = app.docs.paths['/' + serviceName];
  if (!path) return;
  if (postExample) {
    path.post.parameters[0].schema = postExample;
  }
  if (postDescription) {
    path.post.description = postDescription;
  }
  delete path.post.parameters[0].schema;
  delete path.post.responses;
};

module.exports = swaggerServiceConfiguration;
