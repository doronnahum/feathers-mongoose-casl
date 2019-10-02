# pick

Use to pick fields from object  


```text
const {pick} = require('feathers-mongoose-casl');

const user = {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  };
  
  const data1 = pick(user, ['_id', 'title']);
  const data2 = pick(user, ['-body','-title']);
  const data3 = pick(user, [{path: 'address', when: {'user.id': 'theId'}, then: ['name'], otherwise: ['id']}]);
  const data4 = pick(user, [{path: 'address', select: ['name']}]);
  const data5 = pick(user, [{path: 'company', select: ['name']}]);
```

