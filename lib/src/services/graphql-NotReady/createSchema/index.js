const { schemaComposer } = require('graphql-compose');
const getServiceFields = require('./getServiceFields');

const createSchema = function ({ app }) {
  const queryFields = {};
  const mutationFields = {};
  const allServiceKeys = Object.keys(app.services);

  allServiceKeys.forEach(serviceName => {
    const serviceFields = getServiceFields(app, serviceName);
    if (serviceFields) {
      // Query
      queryFields[`${serviceFields.serviceName}ById`] = serviceFields.ById;
      queryFields[`${serviceFields.serviceName}ByIds`] = serviceFields.ByIds;
      queryFields[`${serviceFields.serviceName}`] = serviceFields.Many;
      queryFields[`${serviceFields.serviceName}Count`] = serviceFields.Count;
      // Mutation
      // TODO: Need to customize the resolves like in the query
      mutationFields[`${serviceFields.serviceName}CreateOne`] = serviceFields.CreateOne;
      mutationFields[`${serviceFields.serviceName}CreateMany`] = serviceFields.CreateMany;
      mutationFields[`${serviceFields.serviceName}UpdateById`] = serviceFields.UpdateById;
      mutationFields[`${serviceFields.serviceName}UpdateMany`] = serviceFields.UpdateMany;
      mutationFields[`${serviceFields.serviceName}RemoveById`] = serviceFields.RemoveById;
      mutationFields[`${serviceFields.serviceName}RemoveOne`] = serviceFields.RemoveOne;
      mutationFields[`${serviceFields.serviceName}RemoveMany`] = serviceFields.RemoveMany;
    }
  });
  schemaComposer.Query.addFields(Object.assign({}, queryFields));
  schemaComposer.Mutation.addFields(Object.assign({}, mutationFields));

  const graphqlSchema = schemaComposer.buildSchema();
  return graphqlSchema;
};

module.exports = createSchema;
