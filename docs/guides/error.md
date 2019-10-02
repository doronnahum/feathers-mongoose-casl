# Error

{% embed url="https://docs.feathersjs.com/api/errors.html" %}



```text
const errors = require('@feathersjs/errors');
const {NotFound} = require('@feathersjs/errors');

// If you were to create an error yourself.
const notFound = new errors.NotFound('User does not exist');

// You can wrap existing errors
const existing = new errors.GeneralError(new Error('I exist'));

// You can also pass additional data
const data = new errors.BadRequest('Invalid email', {
  email: 'sergey@google.com'
});

// You can also pass additional data without a message
const dataWithoutMessage = new errors.BadRequest({
  email: 'sergey@google.com'
});// If you were to create an error yourself.
const notFound = new errors.NotFound('User does not exist');

// You can wrap existing errors
const existing = new errors.GeneralError(new Error('I exist'));

// You can also pass additional data
const data = new errors.BadRequest('Invalid email', {
  email: 'sergey@google.com'
});

// You can also pass additional data without a message
const dataWithoutMessage = new errors.BadRequest({
  email: 'sergey@google.com'
});
```

