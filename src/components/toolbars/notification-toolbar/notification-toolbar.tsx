import './notification-toolbar.scss';
import { Template } from 'devextreme-react/core/template';
import Toolbar, { Item } from 'devextreme-react/ui/toolbar';
import { useEffect, useRef } from 'react';
import { appConstants } from '../../../constants/app-constants';
import { NotificationEmptyIcon, NotificationIcon } from '../../icons/icons';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { NotificationListDialogProps } from '../../../models/dialogs/notification-list-dialog-props';
import { useAppSharedContext } from '../../../contexts/app-shared-context';
import { useAppSharedStateDispatcherContext } from '../../../contexts/app-shared-state-dispatcher-context';

export const NotificationToolbar = () => {
  const { showDialog } = useCommonDialogsContext();
  const itemRef = useRef<HTMLDivElement>(null);
  const { notificationCount, setNotificationCount } = useAppSharedContext();
  const { updateNotificationCount } = useAppSharedStateDispatcherContext();

  useEffect(() => {
    (async () => {
      await updateNotificationCount();
    }) ();
  }, [updateNotificationCount]);

  return (
    <>
      <Toolbar>
        <Item
          location={'after'}
          widget={'dxButton'}
          cssClass={'app-rounded-button'}
          options={{
            template: 'notificationMenuTemplate',
            elementAttr: {
              className: 'app-rounded-button',
            },
            onClick: () => {
              showDialog('NotificationListDialog', {
                visible: true,
                targetItem: itemRef.current,
                callback: () => {
                  setNotificationCount(prevState => --prevState);
                }
              } as NotificationListDialogProps);
            },
          }}
        />

        <Template
          name='notificationMenuTemplate'
          render={() => {
            return(
              <div id={'notification-toolbar-button'} ref={itemRef}>
                <span className={'notification-toolbar-badge'}>{notificationCount > 0 ? notificationCount : null}</span>
                {notificationCount
                  ? <NotificationIcon size={appConstants.appearance.bigIconSize}/>
                  : <NotificationEmptyIcon size={appConstants.appearance.bigIconSize}/>}
              </div>
            );
          }}
        />
      </Toolbar>
    </>
  );
};
