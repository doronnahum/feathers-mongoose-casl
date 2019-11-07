# Mongoose schema

{% hint style="warning" %}
## Need a regular mongoose schema ?

Inside the model file, pass also a mongoose schema
{% endhint %}

{% hint style="warning" %}
```javascript
// posts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const postsValidators = require('../validators/posts.validators.js');
const {createModelFromJoi} = require('feathers-mongoose-casl');
var mongoose = require('mongoose');

const mongooseSchema = var sampleSchema = new mongoose.Schema({ name: { type: String, required: true } });
module.exports = function (app) {
  return createModelFromJoi(app, 'posts', postsValidators, mongooseSchema);
};
```
{% endhint %}

Why we use JOI

1. You need to create a validator file for each mongoose service in your app
2. The file need to export a function that will return a [JOI](https://github.com/hapijs/joi) schema
3. With [joigoose](https://github.com/yoitsro/joigoose) we will convert this schema to mongoose schema
4. With [joi2jso](https://github.com/yolopunk/joi2jso) we will convert this scheme to JSON schema for the dashboard

