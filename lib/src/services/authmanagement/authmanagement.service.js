// Initializes the `authmanagement` service on path `/authmanagement`
const authManagement = require('feathers-authentication-management');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');

/**
 * Returns new object with values cloned from the original object. Some objects
 * (like Sequelize or MongoDB model instances) contain circular references
 * and cause TypeError when trying to JSON.stringify() them. They may contain
 * custom toJSON() or toObject() method which allows to serialize them safely.
 * Object.assign() does not clone these methods, so the purpose of this method
 * is to use result of custom toJSON() or toObject() (if accessible)
 * for Object.assign(), but only in case of serialization failure.
 *
 * @param {Object?} obj - Object to clone
 * @returns {Object} Cloned object
 */
var cloneObject = function cloneObject(obj) {
  var obj1 = obj;

  if (typeof obj.toJSON === 'function' || typeof obj.toObject === 'function') {
    try {
      JSON.stringify(Object.assign({}, obj1));
    } catch (e) {
      console.log('Object is not serializable');
      obj1 = obj1.toJSON ? obj1.toJSON() : obj1.toObject();
    }
  }

  return Object.assign({}, obj1);
};

var sanitizeUserForClient = function sanitizeUserForClient(user) {
  var user1 = cloneObject(user);

  delete user1.password;
  delete user1.verifyExpires;
  delete user1.verifyToken;
  delete user1.verifyShortToken;
  delete user1.verifyChanges;
  delete user1.resetExpires;
  delete user1.resetToken;
  delete user1.resetShortToken;
  delete user1.roles;

  return user1;
};

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.configure(
    authManagement(
      {
        app,
        service: '/users', // need exactly this for test suite
        path: 'authManagement',
        notifier: notifier(app).notifier,
        longTokenLen: 15, // token's length will be twice this
        shortTokenLen: 6,
        shortTokenDigits: true,
        resetDelay: 1000 * 60 * 60 * 2, // 2 hours
        delay: 1000 * 60 * 60 * 24 * 5, // 5 days
        identifyUserProps: ['email'],
        sanitizeUserForClient: sanitizeUserForClient
      }
    )
  );

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
  service.options = Object.assign({
    skipAbilitiesCheck: true
  }, service.options);
  service.hooks(hooks);
};