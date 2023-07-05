import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { SubdivisionMembersDialogContent } from './subdivision-members-dialog-content';
import { SubdivisionMembersDialogProps } from '../../../models/dialogs/subdivision-members-dialog-props';
import { PopupTitle } from '../popup-title';

// eslint-disable-next-line no-empty-pattern
export const SubdivisionMembersDialog = (props: SubdivisionMembersDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Состав подразделения'} dialogName={'SubdivisionMembers'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={700}
      visible={true}
      onHidden={() => {
        showDialog('SubdivisionMembersDialog', { visible: false } as DialogProps);
      }}
    >
      <SubdivisionMembersDialogContent {...props} />
    </Popup>
  );
};
