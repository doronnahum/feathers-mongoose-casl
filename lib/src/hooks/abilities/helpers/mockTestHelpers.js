module.exports = {
  getHook: ({method = 'create', query = {}, data = {}}) => {
    return {
      method,
      app: {
        service: () => {
          return { 
            get: () => {}
          };
        },
        info: () => '',
        error: () => ''
      },
      params: {
        query
      },
      data 
    };
  },
  getUser: (USER_RULES_IDS_FOR_TEST) => async function(){
    return {
      user: {
        Id: '1324',
        rules: USER_RULES_IDS_FOR_TEST
      },
      hasUser: true,
      userId: '1324',
      userRulesIds: USER_RULES_IDS_FOR_TEST
    };
  },
  getRules: (RULES_FOR_TEST) => {
    return async function(){
      return {
        rules: RULES_FOR_TEST,
        defaultRules: []
      };
    };
  }
};