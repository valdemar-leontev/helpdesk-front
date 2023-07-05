import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { appConstants } from '../../../../constants/app-constants';

export const TextVariant = () => {

  return (
    <Form>
      <SimpleItem
        dataField={'description'}
        isRequired={true}
        label={{ visible: false }}
        editorType={'dxTextBox'}
        editorOptions={
          {
            placeholder: appConstants.strings.yourAnswer,
            stylingMode: 'underlined'
          }
        }
      />
    </Form>
  );
};
