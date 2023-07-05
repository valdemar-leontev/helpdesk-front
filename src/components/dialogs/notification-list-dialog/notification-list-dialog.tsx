import './notification-list-dialog.scss';
import { Popup, Position } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { NotificationListDialogContent } from './notification-list-dialog-content';
import { NotificationListDialogProps } from '../../../models/dialogs/notification-list-dialog-props';
import { PopupTitle } from '../popup-title';

export const NotificationListDialog = ({ targetItem, callback }: NotificationListDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Уведомления'} dialogName={'NotificationList'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup notification-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      hideOnOutsideClick={true}
      showTitle={true}
      height={300}
      maxWidth={400}
      minWidth={320}
      visible={true}
      onHidden={() => {
        showDialog('NotificationListDialog', { visible: false } as NotificationListDialogProps);
      }}
    >
      <Position of={`#${targetItem?.id}`} my={'right top'} at={ 'right bottom'} offset={{ y: 0 }} />
      <NotificationListDialogContent callback={callback} visible={false} />
    </Popup>
  );
};