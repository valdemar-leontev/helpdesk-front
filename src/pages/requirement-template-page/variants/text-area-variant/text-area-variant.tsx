import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { useTextAreaVariantToolbarItems } from './use-text-area-variant-toolbar-items';

export const TextAreaVariant = () => {

  const toolbarItems = useTextAreaVariantToolbarItems();

  return (
    <Form>
      <SimpleItem
        label={{ visible: false }}
        editorType={'dxHtmlEditor'}
        editorOptions={{
          height: 325,
          stylingMode: 'underlined',
          toolbar: {
            multiline: false,
            items: toolbarItems,
          },
        }} />
    </Form>

  );
};
