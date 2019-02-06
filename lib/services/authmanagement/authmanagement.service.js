// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app)));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');
  // Swagger docs
  if(app.docs && app.docs.paths['/authManagement']){
    app.docs.paths['/authManagement'].post.description = 'sendResetPwd, passwordChange, verifySignupLong, checkUnique, resendVerifySignup';
    app.docs.paths['/authManagement'].post.parameters[0].schema = {
      type: 'object',
      example: { 
        'example-resendVerifySignup':{  
          'action':'resendVerifySignup',
          'value':{  
            'email':'userEaail@gmail.com'
          }
        },
        'example-checkUnique':{  
          'info':'return 200 only if is Unique email',
          'action':'resendVerifySignup',
          'value':{  
            'email':'userEaail@gmail.com'
          }
        },
        'example-verifySignupLong':{  
          'action':'verifySignupLong',
          'value':'281813b93785a68e7590833bed58e5'
        },
        'example-passwordChange':{  
          'action':'passwordChange',
          'value':{  
            'user':{  
              'email':'userEmail@gmail.com'
            },
            'oldPassword':'password',
            'password':'1234578'
          }
        },
        'example-sendResetPwd':{  
          'action':'sendResetPwd',
          'value':{  
            'email':'userEmail@gmail.com'
          }
        }
      }};
  }
  service.hooks(hooks);
};