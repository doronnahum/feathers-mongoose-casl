# doc Layout

Doc layout is array of field that help you to manage the layout of the fields in the document.

with doc layout you can add custom fields, fields with condition :  


### Render fields in the same Row

```text
[
    '_id',
    ['firstName', 'lastName']
]
```

### Render custom field - link type

```text
[
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
[
  when: {
    field: 'type',
    equalTo: OFFICES_TYPE.other,
    then: 'other_type'
  }
]
```

{% page-ref page="custom-fields/customrenderfield.md" %}

{% page-ref page="custom-fields/customelements.md" %}



