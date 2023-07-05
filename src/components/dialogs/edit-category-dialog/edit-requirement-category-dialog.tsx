import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { EditRequirementCategoryDialogContent } from './edit-requirement-category-dialog-content';
import { EditRequirementCategoryDialogProps } from '../../../models/dialogs/edit-requirement-category-dialog-props';
import { PopupTitle } from '../popup-title';

// eslint-disable-next-line no-empty-pattern
export const EditRequirementCategoryDialog = (props: EditRequirementCategoryDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Категория'} dialogName={'EditRequirementCategory'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={500}
      minHeight={300}
      visible={true}
      onHidden={() => {
        showDialog('EditRequirementCategoryDialog', { visible: false } as DialogProps);
      }}
    >
      <EditRequirementCategoryDialogContent { ...props } />
    </Popup>
  );
};
