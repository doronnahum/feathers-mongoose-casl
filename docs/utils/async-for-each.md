# Async For Each

```javascript
const {asyncForEach} = require('feathers-mongoose-casl');

async get(id, params) {
  await asyncForEach([1,2,3], async function(item){
    await doSomething(item);
  })
}
```

