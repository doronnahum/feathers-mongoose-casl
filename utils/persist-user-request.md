# Persist user request

When the client make request to one service and inside the hook of the service you want to fetch data from another service you can persist user and provider to keep the user abilities  


#### Example of use from hook:

```javascript
const {callingParamsPersistUser} = require('feathers-mongoose-casl')

// Inside some hook
hooks({
    before: {
      get: [
        async function(hook){
        const productService =  hook.app.service('products');
        const product = await productService.find(callingParamsPersistUser(hook.params,{query: {'color': 'red'}}))
        };
})
```

### Example of use from class:

```javascript
  async find (params) {
        const productService =  hook.app.service('products');
        const product = await productService.find(callingParamsPersistUser(params,{query: {'color': 'red'}}))
  }
```

