# custom Fields



```
custom Fields options:

link
-------------------------
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

customRenderField
-------------------------
{
  type: 'custom',
  customFieldType: 'customRenderField',
  fieldProps: {name: 'anyUsefulData'}
}

customElements
-------------------------
{
  type: 'custom',
  customFieldType: 'customElements',
  customElementName: 'MyComponentName',
  itemKey: 'keyInDoc',
  customElementProps: {key: 'value'}
}
```

{% page-ref page="customelements.md" %}

{% page-ref page="customrenderfield.md" %}



