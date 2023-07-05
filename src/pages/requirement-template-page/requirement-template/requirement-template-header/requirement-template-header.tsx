import './requirement-template-header.scss';
import '../question-card/question-card.scss';
import { useRequirementTemplateContext } from '../../../../contexts/requirement-template-context';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { useAppDataContext } from '../../../../contexts/app-data-context';
import { appConstants } from '../../../../constants/app-constants';
import { Switch } from 'devextreme-react/ui/switch';

export const RequirementTemplateHeader = () => {

  const { currentRequirementTemplate } = useRequirementTemplateContext();
  const { saveRequirementTemplateAsync } = useAppDataContext();

  return (
    <div className={'card'}>
      <Form formData={currentRequirementTemplate} onFieldDataChanged={async () => {
        await saveRequirementTemplateAsync(currentRequirementTemplate!);
      }}>
        <SimpleItem
          dataField={'name'}
          isRequired={true}
          label={{ visible: false }}
          editorType={'dxTextBox'}
          editorOptions={
            {
              hint: appConstants.strings.requirementTemplateName,
              placeholder: appConstants.strings.newForm,
              showClearButton: true,
              stylingMode: 'underlined'
            }
          }
        />

        <SimpleItem
          dataField={'description'}
          isRequired={false}
          label={{ visible: false }}
          editorType={'dxTextBox'}
          editorOptions={
            {
              hint: appConstants.strings.formDescription,
              placeholder: appConstants.strings.description,
              showClearButton: true,
              stylingMode: 'underlined'
            }
          }
        />
      </Form>

      <div className={'requirement-template-header-category'}>
        <span>Заявка с категорией</span>
        <Switch defaultValue={currentRequirementTemplate?.hasRequirementCategory} onValueChanged={async (e) => {
          currentRequirementTemplate!.hasRequirementCategory = e.value;
          await saveRequirementTemplateAsync(currentRequirementTemplate!);
        }} />
      </div>
    </div>
  );
};