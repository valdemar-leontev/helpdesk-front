import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { EditProfileDialogContent } from './edit-profile-dialog-content';
import { EditProfileDialogProps } from '../../../models/dialogs/edit-profile-dialog-props';
import { PopupTitle } from '../popup-title';

// eslint-disable-next-line no-empty-pattern
export const EditProfileDialog = (props: EditProfileDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Профиль'} dialogName={'EditProfile'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={500}
      visible={true}
      onHidden={() => {
        showDialog('EditProfileDialog', { visible: false } as DialogProps);
      }}
    >
      <EditProfileDialogContent { ...props } />
    </Popup>
  );
};
