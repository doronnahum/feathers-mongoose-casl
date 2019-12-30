# Dashboard Config

### Example of dashboardConfig

```text
     dashboardConfig: {
      sideBarIconName: 'SettingsInputComponent',
      docLayout: [
        '_id',
        'updatedAt',
        'createdAt',
        ['title',
          'description'],
        ['room',
          'controller'],
        'type',
        ['controllerType',
          'switchingType'],
        'schedules',
        'status',
        {
          when: {
            field: 'type',
            equalTo: OFFICES_TYPE.other,
            then: 'other_type'
          }
        },  
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
      ],
      i18n: {
        'heIL': {
          serviceName: 'רכיבים',
          serviceNameMany: 'רכיבים',
          serviceNameOne: 'רכיב',
          fields: {
            '_id': 'מזהה',
            'updatedAt': 'עודכן',
            'createdAt': 'נוצר',
            title: 'כותרת',
            description: 'תיאור',
            room: 'חדש',
            controller: 'בקר',
            type: 'סוג',
            controllerType: 'סוג בקר',
            switchingType: 'סוג המתג',
            schedules: 'לוח זמנים',
            status: 'סטאטוס',
            floorPlan: 'תכנון קומה',
          }
        }
      }
    }
```

<table>
  <thead>
    <tr>
      <th style="text-align:left">key</th>
      <th style="text-align:left">type</th>
      <th style="text-align:left">info</th>
      <th style="text-align:left">example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">hide</td>
      <td style="text-align:left">boolean</td>
      <td style="text-align:left">set true to hide this service from dashboard</td>
      <td style="text-align:left"></td>
    </tr>
    <tr>
      <td style="text-align:left">sideBarIconName</td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">
        <p>allow you to change the default icon on the dashboard sidebar</p>
        <p>can be of of the <a href="https://material-ui.com/components/material-icons/">https://material-ui.com/components/material-icons/</a>
        </p>
      </td>
      <td style="text-align:left">&apos;user&apos;</td>
    </tr>
    <tr>
      <td style="text-align:left">defaultFieldsToDisplay</td>
      <td style="text-align:left">array</td>
      <td style="text-align:left">to hide default fields without using the layout</td>
      <td style="text-align:left">[&apos;_id&apos;,&apos;createdAt&apos;,&apos;updatedAt&apos;]</td>
    </tr>
    <tr>
      <td style="text-align:left">docLayout</td>
      <td style="text-align:left">array</td>
      <td style="text-align:left">
        <p>controll the layout of the document</p>
        <p></p>
        <p>add custom fields</p>
      </td>
      <td style="text-align:left"></td>
    </tr>
    <tr>
      <td style="text-align:left">docTitleField</td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">The field to display as page title when edit a document</td>
      <td style="text-align:left">
        <p></p>
        <p></p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">populate</td>
      <td style="text-align:left">array</td>
      <td style="text-align:left">
        <p>Use populate When you want the table to populate fields</p>
        <p>
          <br />This property only adds the populate to client request,</p>
        <p>you still need to handle the ability, read this</p>
      </td>
      <td style="text-align:left"></td>
    </tr>
    <tr>
      <td style="text-align:left">hideNewButton</td>
      <td style="text-align:left">boolean</td>
      <td style="text-align:left">set true to hide the new button</td>
      <td style="text-align:left"></td>
    </tr>
    <tr>
      <td style="text-align:left">actionButtonsPosition</td>
      <td style="text-align:left">string</td>
      <td style="text-align:left">
        <p>enums: &apos;start&apos;, &apos;end&apos;</p>
        <p>by default the action buttons render at the end of the row</p>
      </td>
      <td style="text-align:left"></td>
    </tr>
  </tbody>
</table>

\*\*\*\*

  
  
**related docs:**

{% page-ref page="./" %}

{% page-ref page="../../populate.md" %}

{% page-ref page="custom-fields/customelements.md" %}



