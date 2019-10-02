# Update posts service

{% hint style="info" %}
Now we want to add [JOI](https://github.com/hapijs/joi) and [CASL](https://github.com/stalniy/casl) to posts service.

with JOI we going to:  
1- validate user request  
2- generate a mongoose schema  
3- generate a dashboard screen  
4- generate a [swaager](https://swagger.io/) doc  
  
with CASLE we going to handle user abilities  
  
We do this by create a validators file and by replace the createService from feathers-mongoose with createService from  feathers-mongoose-casl
{% endhint %}

### 1. Inside the validators folder create this file posts.validators.js



{% code-tabs %}
{% code-tabs-item title="src\\validators\\posts.validators.js" %}
```javascript
const {Joi} = require('feathers-mongoose-casl');

const getJoiObject = function(withRequired){
  const required = withRequired ? 'required' : 'optional';
  return Joi.object({
    author: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'users',
      displayKey: 'email'
    })[required](),
    title: Joi.string().min(5)[required]().meta({
      dashboard: {
        label: 'Post title',
        inputProps: JSON.stringify({style: {background: 'red'}})
      }
    }),
    body: Joi.string()[required](),
    rating: Joi.number().max(5).meta({
      dashboard: {
        hideOnUpdate: true,
        hideOnCreate: true,
      }
    }),
    image: Joi.objectId().meta({
      type: 'ObjectId',
      ref: 'files',
      displayKey: 'name'
    })
  });
};

module.exports = getJoiObject;
```
{% endcode-tabs-item %}

{% code-tabs-item title=undefined %}
```

```
{% endcode-tabs-item %}
{% endcode-tabs %}

### 3. Create guide file

3.1 Create \_Guide.md file inside validators folder  
       src &gt; validators &gt; \_Guide.md

3.2 Copy the content from the code snippet

{% code-tabs %}
{% code-tabs-item title=undefined %}
```
// This only for help us create a validators files,
// copy the content from tab2 in this code cnippet
```
{% endcode-tabs-item %}

{% code-tabs-item title="\_Guide-JoiToMongoose.md" %}
    ## feathers-mongoose-casl - validators

      # [Link to this guide](https://feathersjs-mongoose.gitbook.io/feathers-mongoose-casl/guides/joigoose)


    ### This file is here to help you build validators files in feathers-mongoose-casl

     1. You need to create a validator file for each mongoose service in your app
     2. The file need to export a function that will return a [JOI](https://github.com/hapijs/joi) schema
     3.  [joi2jso](https://github.com/yolopunk/joi2jso) will help us to convert this schema to mongoose schema

    ## Example
    ```jsx
    const {Joi} =  require('feathers-mongoose-casl'); 

    const  getJoiObject  =  function(withRequired){
    	const  required  =  withRequired  ?  'required'  :  'optional';
    	return  Joi.object({
    		user:  Joi.objectId().meta({ type:  'ObjectId', ref:  'users', displayKey:  'email', })[required](),
    		title:  Joi.string(),
    		message:  Joi.string(),
    		icon:  Joi.string().meta({dashboard: {list: {hide:  1}}}),
    		img:  Joi.string().meta({dashboard: {list: {hide:  1}}}),
    		link:  Joi.string().allow(null).meta({dashboard: {list: {hide:  1}}}),
    		linkText:  Joi.string().allow(null).meta({dashboard: {list: {hide:  1}}}),
    		isRead:  Joi.boolean().meta({dashboard: {readOnly:  1, initialValue:  false}, default:  false},),
    		readTime:  Joi.date().meta({dashboard: {readOnly:  1}}),
    		type:  Joi.string().valid('info','success','error','warning')
    	});
    };



    module.exports  =  getJoiObject;
    ```



    ## What is this \[required]() ?
    When you want to make field required you need to add \[required]() in the end
    in this way we can make it required only when client try to create document,
    if you want the field to be required even on update then just write required().

      - getJoiObject(true) - will check client request with required tests.
      - getJoiObject(false) - will check client request without the required tests.


    # Types

     - **String**
    	 ```jsx
    	 someField:  Joi.string()
    	 ```
     - **Unique string**
    	 ```jsx
    	 someField: Joi.string()[required]().meta({unique: true}),
    	 ```
     - **String with enums**
    	 ```jsx
    	 someField: Joi.string().valid('private', 'public','blocked'),
    	 ```
     - **Number**
    	 ```jsx
    	 someField:  Joi.number()
    	 ```
     - **Date**
    	 ```jsx
    	 someField:  Joi.date()
    	 ```
     - **Boolean**
    	 ```jsx
    	 someField:  Joi.boolean()
    	 ```
     - **Arrays**
    	 ```jsx
    	 someField:  Joi.array()
    	 ```
     - **Arrays of String**
    	 ```jsx
    	 someField:  Joi.array().items(Joi.string())
    	 ```
     - **Arrays of Reference**
    	 ```jsx
    	 someField:  Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'rules', displayKey: 'name' })),
    	 ```
     - **Object**
    	 ```jsx
    	 someField:  Joi.object({
    		user: Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'email' }),
    		rules: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'users', displayKey: 'name'})),
    		blockAll: Joi.boolean()
    		})
    	 ```

    ## Allow null?
    ```jsx
    verifyExpires: Joi.date().allow(null)
    ```
    ## Default Value?
    ```jsx
    status: Joi.string().meta({ default: 'pending'})
    ```
    ## How to customize the feathers-mongoose-casl dashboard
    ```jsx
    .meta({ 
    	dashboard: {
    		label: 'FieldName', // Input label and table title
    		hide: 0, // set 1 to Hide this field from the tableand the documents 
    		allowNull: 0, // Set 1 to allow clear date and select fields
    		list: {
    			hide: 0, // set 1 to Hide this field from the table
    			label: null, // string if you want to change the table title
    			width: 100, // table colum width
    			type: 'link' // if you want to convert table field to <a href={value} />
    		},
    		doc: {
    			hide: 0, // set 1 to Hide this field from the document
    			hideOnCreate: 0, // set 1 to Hide this field in a new document
    			hideOnUpdate: 0, // set 1 to Hide this field when edit a document
    			inputProps: JSON.stringify({style: {background: 'red'}}),
    			inputType: 'file', // oneOf:['file','boxSelect','textArea']
    			initialValue: 'David', // any value to use as inital value in a new document
    			readOnly: false, // Allow to update this field only in a new document
    			displayKey: string, // reference fields - the field name to dispaly the user
    			optionKey: string, // reference fields - the uniqe field key - default is _id
    		}
    }})

    // meta on object - workaround,
    // We have a problem with metadata after an object // and therefore we have to pass the information // through one of the children in this way

    someField: Joi.object().keys({
    	name: Joi.number().meta({
    		parentDashboard : {
    			list: {hide: 1}
    		}
    		}),
    	age: Joi.number(),
    })

    // Fields with enums- 
    // How to add labels And icon
    someFile: Joi.string().valid(Object.values(BUILDINGS_TYPE)).meta({
    	dashboard: {
    		doc: {
    			options: [
    			{value: BUILDINGS_TYPE['office_building'], label: 'Office Building'},
    			{value: BUILDINGS_TYPE['stadium'], label: 'Stadium'},
    			{value: BUILDINGS_TYPE['theatre'], label: 'Theatre'},
    			{value: BUILDINGS_TYPE['branch', icon: 'optionalAntdIcon'], label: 'Branch'},
    			{value: BUILDINGS_TYPE['gym'], label: 'Gym'},
    			]
    			}
    		}
    	}
    )

    // Date - initialValue
    // You can set now date like that-
    visit_from: Joi.date().meta({
    	dashboard: {
    		doc: {
    		initialValue: 'date-now' // in the client we conver this with a real date
    		}
    	}
    })
    ```

    # Need a regular mongoose schema ?

    Inside the model file, pass also a mongoose schema
    ```
    // posts-model.js - A mongoose model
    //
    // See http://mongoosejs.com/docs/models.html
    // for more of what you can do here.

    const postsValidators =  require('../validators/posts.validators.js');
    const  {createModelFromJoi}  =  require('feathers-mongoose-casl');
    var mongoose =  require('mongoose');
    const mongooseSchema =  var sampleSchema =  new  mongoose.Schema({ name:  { type: String, required:  true  }  });

    module.exports  =  function  (app)  {
    	return  createModelFromJoi(app,  'posts', postsValidators, mongooseSchema);
    };
    ```

    ### How to handle doc layout:
    Inside the service.option
    ```jsx
    dashboardConfig: {

    sideBarIconName: 'schedule',

    docLayout: [
    	'office_id',
    	'idNumber',
    	['userMobilePhone','email'],
    	['firstName','lastName'],
    	'keyType',
    	{
    	when: {
    		field: 'keyType',
    		equalTo: KEY_TYPE.temporary,
    		then: ['visit_from','visit_to'],
    		otherwise: null
    		}
    	},
    	'notes'
    	]
    }
    ```
{% endcode-tabs-item %}
{% endcode-tabs %}

Some of the code snippets include more than one tab

### 4. Update Posts model

open src &gt; models &gt; posts.models.js

{% code-tabs %}
{% code-tabs-item title="src\\models\\posts.model.js" %}
```javascript
// posts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const postsValidators = require('../validators/posts.validators.js');
const {createModelFromJoi} = require('feathers-mongoose-casl');

module.exports = function (app) {
  return createModelFromJoi(app, 'posts', postsValidators);
};

```
{% endcode-tabs-item %}
{% endcode-tabs %}

### 5. Update posts.service

open src &gt; services &gt; posts &gt; posts.service.js  
and  replace **createService**  from feathers-mongoose with **createService**  from feathers-mongoose-casl

**Before**

```text
 const createService = require('feathers-mongoose')
```

**After**

```text
const {createService} = require('feathers-mongoose-casl');
```

5.2 Add **abilities** to service options

```javascript
    const options = {  
      abilities: [
      {'actions': ['read'], 'anonymousUser': true, fields: ['title']}, // anonymousUser can read posts
      {'actions': ['create','read','update'], 'conditions': { 'author': '{{ user._id }}' }}, // user can CRUD only his own posts
      { 'actions': ['manage'], 'roles': ['admin']}, // admin can manage all posts
      ],
```

{% code-tabs %}
{% code-tabs-item title="src\\services\\posts\\posts.service.js" %}
```javascript
// Initializes the `posts` service on path `/posts`
const {createService} = require('feathers-mongoose-casl');
const createModel = require('../../models/posts.model');
const hooks = require('./posts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    abilities: [
      {'actions': ['read'], 'anonymousUser': true, fields: ['title']},
      {'actions': ['create','read','update'], 'conditions': { 'author': '{{ user._id }}' }},
      { 'actions': ['manage'], 'roles': ['admin']},
    ],
  };

  // Initialize our service with any options it requires
  app.use('/posts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('posts');

  service.hooks(hooks);
};

```
{% endcode-tabs-item %}
{% endcode-tabs %}

### 6. Remove authenticate from posts.hooks

we use a global authenticate then we didn't need this hook,  
src\services\posts\posts.hooks.js

```text
// Remove  authenticate('jwt') 
// ------------------------------
// before
module.exports = {
  before: {
    all: [ authenticate('jwt') ],

// after
module.exports = {
  before: {
    all: [],
```

### Optional - Dashboard configuration

Add to options dashboardConfig:

   


```javascript
  const options = {
    Model,
    ...
    // Add this
    dashboardConfig: {
      sideBarIconName: 'file-text', // Antd icon https://ant.design/components/icon/
      docLayout: [
        ['title','rating'], // Display fileds in the same line
        'body',
        'author',
        'image'
      ]
    }
  };
```

### 7. Commit changes

```text
git add .
git commit -m "Added joi validtors to posts serives"
```

{% hint style="info" %}
## dashboard: 

#### Now you can see the posts service inside the dashboard [https://feathersjs-mongoose-casl-admin.herokuapp.com/ ](install-feathers-mongoose-casl.md)Anyone can read the posts title User can create/update only if he the author Only admin user can delete posts

#### Try to create a new posts from the dashboard
{% endhint %}



