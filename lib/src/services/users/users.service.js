// Initializes the `users` service on path `/users`
const createModel = require('./uses.model');
const hooks = require('./users.hooks');
// feathers-mongoose-casl
// ------------------------
const createService = require('../../utils/createService');
// //un comment to copy to your src folder
// const {createService} = require('feathers-mongoose-casl');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = Object.assign({
    Model,
    paginate,
    serviceRules: [
      {
        'description': 'allow register to your app',
        'actions': ['create'],
        'anonymousUser': true
      }
    ],
    dashboardConfig: {
      sideBarIconName: 'user',
      i18n: {
        'enUS': {
          serviceName: 'Users',
          serviceNameMany: 'Users',
          serviceNameOne: 'User',
          fields: {
            '_id': 'ID',
            'updatedAt': 'Up DatedAt',
            'createdAt': 'Created At',
            'password': 'Password',
            'email': 'Email',
            'isVerified': 'Is Verified',
            'roles': 'Roles'
          }
        },
        'heIL': {
          serviceName: 'משתמשים',
          serviceNameMany: 'משתמשים',
          serviceNameOne: 'משתמש',
          fields: {
            '_id': 'מזהה',
            'updatedAt': 'תאריך עדכון',
            'createdAt': 'נוצר בתאריך',
            'password': 'סיסמא',
            'email': 'דואר אלקטרוני',
            'isVerified': 'יוזר מאושר',
            'roles': 'תפקידים'
          }
        }
      }
    }
  }, app.get('feathers-mongoose-casl').usersServiceOptions);

  // Initialize our service with any options it requires
  const userService = createService(options);
  app.use('/users', userService);
  // Get our initialized service so that we can register hooks
  const service = app.service('users');
  service.hooks(hooks);
};
