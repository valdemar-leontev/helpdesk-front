import { useCallback, useEffect, useRef, useState } from 'react';
import { EditRequirementCategoryDialogProps } from '../../../models/dialogs/edit-requirement-category-dialog-props';
import Form, { Label, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { Button } from 'devextreme-react/ui/button';
import { appConstants } from '../../../constants/app-constants';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { RequirementCategoryModel } from '../../../models/data/requirement-category-model';
import { RequirementCategoryTypeModel } from '../../../models/data/requirement-category-type-model';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { DictionaryBaseModel } from '../../../models/abstracts/dictionary-base-model';
import notify from 'devextreme/ui/notify';

export const EditRequirementCategoryDialogContent = ({ requirementCategory, callback }: EditRequirementCategoryDialogProps) => {
  const { getDictionaryAsync, postRequirementCategoryAsync, putRequirementCategoryAsync } = useAppDataContext();
  const formRef = useRef<Form>(null);
  const { showDialog } = useCommonDialogsContext();
  const [requirementCategoryTypeList, setRequirementCategoryTypeList] = useState<RequirementCategoryTypeModel[] | DictionaryBaseModel[] | null>([]);

  useEffect(() => {
    (async () => {
      const requirementCategoryTypeList = await getDictionaryAsync('RequirementCategoryType');

      if (requirementCategoryTypeList) {
        setRequirementCategoryTypeList(requirementCategoryTypeList);
      }
    })();
  }, [getDictionaryAsync]);

  const onSaveRequirementCategoryAsync = useCallback(async () => {
    const updatedRequirementCategory = {
      id: requirementCategory.id ? requirementCategory.id : 0,
      description: requirementCategory.requirementCategoryDescription,
      requirementCategoryTypeId: requirementCategory.requirementCategoryTypeId,
      hasAgreement: requirementCategory.hasAgreement
    } as RequirementCategoryModel;

    let category: RequirementCategoryModel | null;

    if (updatedRequirementCategory.id !== 0) {
      category = await putRequirementCategoryAsync(updatedRequirementCategory);
    } else {
      category = await postRequirementCategoryAsync(updatedRequirementCategory);
    }

    if (category && callback) {
      showDialog('EditRequirementCategoryDialog', { visible: false } as DialogProps);
      notify('Категория была сохранена', 'success', 3000);
      callback();
    }
  }, [callback, postRequirementCategoryAsync, putRequirementCategoryAsync, requirementCategory, showDialog]);

  return (
    <>
      <Form
        formData={requirementCategory}
        ref={formRef}
      >
        <SimpleItem
          dataField={'requirementCategoryDescription'}
          editorType={'dxTextBox'}
          label={{ text: 'Категория' }}
          editorOptions={{
            stylingMode: 'underlined',
          }}
        >
          <RequiredRule message={'Поле является обязательным'}/>
        </SimpleItem>

        <SimpleItem
          dataField={'requirementCategoryTypeId'}
          editorType={'dxSelectBox'}
          label={{ text: 'Тип' }}
          editorOptions={{
            dropDownOptions: { height: 285 },
            searchEnabled: true,
            stylingMode: 'underlined',
            dataSource: requirementCategoryTypeList,
            valueExpr: 'id',
            displayExpr: 'description',
          }}
        >
          <RequiredRule message={'Поле является обязательным'}/>
        </SimpleItem>

        <SimpleItem
          dataField={'hasAgreement'}
          editorType={'dxCheckBox'}
          editorOptions={{
            text: 'Согласовывать',
            elementAttr: { class: 'form-text' },
          }}
        >
          <Label visible={false}/>
        </SimpleItem>
      </Form>

      <div className='dialog-content__buttons'>
        <Button
          className='dialog-content__button'
          type={'default'}
          text={appConstants.strings.save}
          onClick={async () => {
            await onSaveRequirementCategoryAsync();
          }}
        >
        </Button>
        <Button
          className='dialog-content__button'
          type={'normal'}
          text={appConstants.strings.close}
          onClick={() => {
            showDialog('EditRequirementCategoryDialog', { visible: false } as DialogProps);
          }}
        />
      </div>
    </>
  );
};
