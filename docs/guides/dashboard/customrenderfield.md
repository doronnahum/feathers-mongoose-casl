# customRenderField

customRenderField allow you full control on the document layout  
example:

inside the docLayout in the server service option

```text
    dashboardConfig: {
      sideBarIconName: 'SettingsInputComponent',
      docLayout: [
        ['title',
          'description'],
        {
          type: 'custom',
          customFieldType: 'customRenderField',
          fieldProps: { name: 'someUsefulData' }
        },
        'status'
      ],
```

```text
import { DashboardApp } from 'src/localnode/feathers-mongoose-casl-dashboard';
import customRenderField from './customRenderField';
import 'src/localnode/redux-admin/style.css';

...
return (
<DashboardApp url={screenName} customRenderField={customRenderField} />
```

```text
// customRenderField.js
// --------------------------------
import React from 'react';

export default ({
  field,
  fieldKey,
  fieldLabel,
  lang,
  rtl,
  form,
}) => {
  const { fieldProps } = field; // Data from server from docLayout
  const { values, setFieldValue, setValues } = form;
  // form is formik form, read this https://jaredpalmer.com/formik/docs/api/formik#setfieldvalue-field-string-value-any-shouldvalidate-boolean-void
  return (
    <div>
      name: {fieldProps.name}
      {JSON.stringify(values || {})};
      <button onClick={() => setFieldValue('title', 'newTitle')}>Update Title</button>
      <button onClick={() => setValues({ fields: { title: 'newTitle', description: '54545' } })}> Update Title and description</button>
    </div>
  );
};


```

