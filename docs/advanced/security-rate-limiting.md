# Security - rate limiting

### [express-brute](https://github.com/AdamPflug/express-brute)

Protection middleware for express routes by rate limiting incoming requests

#### Install express-brute

```bash
npm install express-brute express-brute-mongoose --save
```

#### create util folder with a new file requestLimitMiddleware.js

```javascript
const ExpressBrute = require('express-brute');
const MongooseStore = require('express-brute-mongoose');
const BruteForceSchema = require('express-brute-mongoose/dist/schema');
const mongoose = require('mongoose');

const model = mongoose.model(
  'bruteforce',
  new mongoose.Schema(BruteForceSchema)
);
const store = new MongooseStore(model);

const bruteforce = new ExpressBrute(store);

module.exports = bruteforce;
```

#### apply as middleware inside your public routes or any route you want to limit

Need to Add " bruteforce.prevent" before createService\(\)

```javascript
// Initializes the `contact-us` service on path `/contact-us`
const { createService } = require('feathers-mongoose-casl');
const createModel = require('../../models/contact-us.model');
const hooks = require('./contact-us.hooks');
const bruteforce = require('../../utils/requestLimitMiddleware');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    serviceRules: [
      {'actions': ['create'], 'anonymousUser': true}
    ],

  };

  // Initialize our service with any options it requires
  app.use(
    '/contact-us',
    bruteforce.prevent, // Limit user request
    createService(options)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('contact-us');

  service.hooks(hooks);
};
```

You can use others[ bruteforce adapters](https://github.com/AdamPflug/express-brute#expressbrute-stores) to handle the users request

