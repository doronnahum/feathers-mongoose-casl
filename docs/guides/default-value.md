# Default value

### You can set default value from:

1- hook.before.create

```javascript
module.exports = {  before: {    all: [],    find: [],    get: [],    create: [(context) => {        if(context.data && !context.data.hasOwnProperty('defaultNumber')){            context.data.defaultNumber = 10;        ];        return context       }],....
```

2- using mongoose default

```javascript
return Joi.object({    defaultNumber: Joi.number().meta({default: 10})})
```

### Dashboard support 

How to show in the dashboard screen initial value?

```javascript
return Joi.object({    defaultNumber: Joi.number().meta({        default: 10,        dashboard: {            doc: {              initialValue: 10          }        }    })})
```

