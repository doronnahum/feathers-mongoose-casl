# Example of use

```jsx
const {Joi} =  require('feathers-mongoose-casl'); 

const  getJoiObject  =  function(withRequired){
    const  required  =  withRequired  ?  'required'  :  'optional';
    return  Joi.object({
        user:  Joi.objectId().meta({ 
            type:  'ObjectId',
            ref:  'users',
            displayKey:  'email'
            })[required](),
        title:  Joi.string(),
        message:  Joi.string(),
        icon:  Joi.string(),
        img:  Joi.string(),
        link:  Joi.string().allow(null),
        linkText:  Joi.string().allow(null),
        isRead:  Joi.boolean().meta({default:  false}),
        readTime:  Joi.date(),
        type:  Joi.string().valid('info','success','error','warning')
    });
};



module.exports  =  getJoiObject;
What is this [required]() ?
When you want to make field required you need to add [required]() in the end in this way we can make it required only when client try to create document, if you want the field to be required even on update then just write required().
getJoiObject(true) - will check client request with required tests.
getJoiObject(false) - will check client request without the required tests.
```

