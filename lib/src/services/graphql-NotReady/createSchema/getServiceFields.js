const { composeWithMongoose }  = require('graphql-compose-mongoose');
const resolvers = require('./resolvers');

const getServiceFields = function(app, serviceName){
  try {
    const service = app.services[serviceName];
    const serviceModel = (service && service.options &&  service.options.Model) || null;
    if(!serviceModel) return null;
    
    const customizationOptions = {}; // left it empty for simplicity, described below
    const ServiceTC = composeWithMongoose(serviceModel, customizationOptions);
    
    // Add relations;
    const schemaFields = serviceModel().schema.obj;
    const schemaFieldKeys = Object.keys(schemaFields);
    schemaFieldKeys.forEach(fieldKey => {
      const field = schemaFields[fieldKey];
      const arrayField = (field.type && field.type[0]) || null;
      const ref = field.ref || (arrayField && arrayField.ref);
      if(ref){
        ServiceTC.addRelation(
          fieldKey,
          {
            resolver: () => {
              const p = ServiceTC.getResolver(arrayField ? 'findByIds' : 'findById');
              const refServiceName = ref;
              p.resolve = arrayField ? resolvers.findByIds(app, refServiceName) : resolvers.findById(app, refServiceName);
              return p;
            },
            prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
              [arrayField ? '_ids' : '_id']: (source) => source[fieldKey],
            },
            projection: { [fieldKey]: 1 }, // point fields in source object, which should be fetched from DB
          }
        );
      }
    });
  
    // ------------------------------ Query ------------------------------------------//

    /**
     * findById
     * --------------------------------------------------------------------------------
     * Create findById resolve for the service
     * --------------------------------------------------------------------------------
     */
    const ById = ServiceTC.getResolver('findById');
    /*
    * customize the resolve
    */
    ById.resolve = resolvers.findById(app, serviceName);

    /**
     * findByIds
     * --------------------------------------------------------------------------------
     * Create findById resolve for the service
     * --------------------------------------------------------------------------------
     */
    const ByIds = ServiceTC.getResolver('findByIds');
    /*
    * customize the resolve
    */
    ByIds.resolve = resolvers.findByIds(app, serviceName);

    /**
     * FindMany
     * --------------------------------------------------------------------------------
     * Create findMany resolve for the service
     * --------------------------------------------------------------------------------
     */
    const Many = ServiceTC.getResolver('findMany');
    /*
    * customize the resolve
    */
    Many.resolve = resolvers.findMany(app, serviceName);
  
    /**
     * Add Count
     * --------------------------------------------------------------------------------
     * Create Count resolve for the service
     * --------------------------------------------------------------------------------
     */
    const Count =  ServiceTC.getResolver('count');
    /*
    * customize the resolve
    */
    Count.resolve = resolvers.count(app, serviceName);
    
    // ------------------------------ Mutation ----------------------------------------//
    const CreateOne =  ServiceTC.getResolver('createOne');
    const CreateMany =  ServiceTC.getResolver('createMany');
    const UpdateById =  ServiceTC.getResolver('updateById');
    const UpdateOne =  ServiceTC.getResolver('updateOne');
    const UpdateMany =  ServiceTC.getResolver('updateMany');
    const RemoveById =  ServiceTC.getResolver('removeById');
    const RemoveOne =  ServiceTC.getResolver('removeOne');
    const RemoveMany =  ServiceTC.getResolver('removeMany');

    
    /**
     * Return The service resolves
     * --------------------------------------------------------------------------------
     * comment body
     * --------------------------------------------------------------------------------
     */
    return {
      serviceName,
      // Query
      ById,
      ByIds,
      Many,
      Count,
      // Mutation
      CreateOne,
      CreateMany,
      UpdateById,
      UpdateOne,
      UpdateMany,
      RemoveById,
      RemoveOne,
      RemoveMany
    };
  } catch (error) {
    console.log({error})
  }
};

module.exports = getServiceFields;