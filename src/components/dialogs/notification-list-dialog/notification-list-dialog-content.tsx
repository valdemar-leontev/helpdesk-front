import React, { useEffect, useState } from 'react';
import { NotificationModel } from '../../../models/data/notification-model';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { List } from 'devextreme-react';
import { useNavigate } from 'react-router';
import { NotificationListDialogProps } from '../../../models/dialogs/notification-list-dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import notify from 'devextreme/ui/notify';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { EntityModel } from '../../../models/abstracts/entity-model';

export const NotificationListDialogContent = ({ callback }: NotificationListDialogProps) => {
  const [notificationList, setNotificationList] = useState<NotificationModel[] | null>();
  const { getUserNotificationsAsync, postEntityAsync } = useAppDataContext();
  const navigate = useNavigate();
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();

  useEffect(() => {
    (async () => {
      if (getAuthUser()) {
        let currentNotificationList = await getUserNotificationsAsync();

        if (currentNotificationList) {
          currentNotificationList = currentNotificationList.filter(n => !n.isRead);
          setNotificationList(currentNotificationList);
        }
      }
    })();
  }, [getAuthUser, getUserNotificationsAsync]);

  return (
    <>
      <List
        allowItemDeleting={true}
        itemDeleteMode={'swipe'}
        onItemDeleted={async (item) => {
          if (!item.itemData) {

            return null;
          }
          
          const notification = await postEntityAsync(
              {
                id: item.itemData.id,
                isRead: true
              } as EntityModel,
              {
                entityTypeName: 'Notification',
                updatedProperties: ['IsRead']
              },
              true
          );

          if (notification && callback) {
            setNotificationList(prevState => prevState?.filter(n => n.id !== notification.id));
            callback();
            notify('Уведомление помечено как прочитанное', 'success', 3000);
          }
        }}
        className={'app-list'}
        dataSource={notificationList}
        displayExpr={'message'}
        keyExpr={'id'}
        onItemClick={(e) => {
          navigate('/notifications', { state: { notificationId: e.itemData!.id } });
          showDialog('NotificationListDialog', { visible: false } as NotificationListDialogProps);
        }}
        itemRender={(item: NotificationModel, index) => {
          return (
            <div>
              <div style={{
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
                whiteSpace: 'pre-wrap',
                fontSize: 12
              }}>
                <div>{++index}.</div>
                <span dangerouslySetInnerHTML={{ __html: item.message }}></span>
              </div>

              <span style={{ fontSize: 12, marginLeft: 20, fontWeight: 'bold' }}>{item.creationDate.toLocaleString('ru-RU',
                { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</span>
            </div>
          );
        }}
      />
    </>
  );
};