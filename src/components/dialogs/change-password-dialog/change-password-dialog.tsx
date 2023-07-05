import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { ChangePasswordDialogContent } from './change-password-dialog-content';

// eslint-disable-next-line no-empty-pattern
export const ChangePasswordDialog = ({  }: DialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      wrapperAttr={{ class: 'app-popup' }}
      className={'about-dialog'}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      title={'Смена пароля'}
      height={'auto'}
      maxWidth={700}
      visible={true}
      onHidden={() => {
        showDialog('ChangePasswordDialog', { visible: false } as DialogProps);
      }}
    >
      <ChangePasswordDialogContent />
    </Popup>
  );
};
