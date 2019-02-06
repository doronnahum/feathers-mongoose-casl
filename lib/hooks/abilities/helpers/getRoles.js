

module.exports = async function({hook, testMode}){
   
  // Hard coded roles from config
  const mongooseCaslConfig = hook.app.get('feathers-mongoose-casl') || {};
  if(!mongooseCaslConfig){
    hook.app.error('Missing feathers-mongoose-casl in config file');
  }
  const defaultRoles = mongooseCaslConfig.defaultRoles || [];

  // Roles from DB/CACHE
  let roles;
  const rolesResults = await hook.app.service('/roles').find({
    query: {
      active: true,
      actions: { '$exists': true },
      subject: { '$exists': true }
    },
    disabledCache: testMode // disabledCache in testMode
  });
  if(rolesResults && rolesResults.data){
    roles = rolesResults.data;
  }else{
    hook.app.error('Missing roles from DB', rolesResults);
  }
  return {
    roles,
    defaultRoles
  };
};