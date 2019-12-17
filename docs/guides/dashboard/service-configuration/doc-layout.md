# doc Layout

Doc layout is array of field that help you to manage the layout of the fields in the document.

with doc layout you can add custom fields, fields with condition :  


### Render fields in the same Row

```text
module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate'); // Register validators to validate schema and to register dashboard screen;

  const options = {
    Model,
    paginate,
    serviceRules,
    dashboardConfig: {
      docLayout: 
      [
        '_id',
        ['firstName', 'lastName']
      ]
    }
  };

  // Initialize our service with any options it requires
  app.use('/invitations', new Invitations(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('invitations');

  service.hooks(hooks);
};
```

### Render custom field - link type

```text
docLayout: [
        {
          type: 'custom',
          customFieldType: 'link',
          style: 'button',
          linkTemplate: 'dashboard/floor-plan?floorId={{ _id }}',
          label: 'Plan',
          itemKey: 'linkToPlan',
          hideOnCreate: true,
          hideOnUpdate: false,
         }
]
```

### Render field with condition 

```text
// equalTo
docLayout : [
  {
    when: {
      field: 'type',
      equalTo: OFFICES_TYPE.other,
      then: 'other_type'
    }
  }
]
// conditions (read sift query - https://github.com/crcn/sift.js/tree/master)
docLayout : [
  {
    when: {
      conditions: {tags: { $in: ["hello", "world"] }},
      then: 'other_type',
      otherwise: 'tags'
    }
  }
]
```

{% page-ref page="custom-fields/customrenderfield.md" %}

{% page-ref page="custom-fields/customelements.md" %}



