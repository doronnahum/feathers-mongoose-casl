# debug

### debug mongoose

add mongoose.set\('debug', true\); 

{% code title="src > mongoose.js" %}
```javascript
const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true); // ADD THIS
  app.set('mongooseClient', mongoose);
};

/*
or
  const isProduction = process.env.NODE_ENV === 'production';
  if(!isProduction){
    mongoose.set('debug', true);
  }
*/

```
{% endcode %}

### debug  feathers-mongoose-casl

run this command

```bash
$ cross-env DEBUG=feathers-mongoose-casl nodemon -prof src/
```

