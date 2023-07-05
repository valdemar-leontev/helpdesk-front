import './notifications-page.scss';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { Navbar } from '../../components/navbar/navbar';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDataContext } from '../../contexts/app-data-context';
import { NotificationModel } from '../../models/data/notification-model';
import { Column, Pager, Paging, SearchPanel } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { DataGrid, GroupPanel, Item, Scrolling, Toolbar } from 'devextreme-react/ui/data-grid';
import {
  CheckmarkIcon,
  DayIcon,
  DeleteIcon,
  ExtensionVertIcon,
  EyeIcon,
  ListIcon,
  MonthIcon,
  RequirementStateAgreedIcon,
  WeekIcon
} from '../../components/icons/icons';
import { appConstants } from '../../constants/app-constants';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { useLocation, useNavigate } from 'react-router';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';
import notify from 'devextreme/ui/notify';
import { EntityModel } from '../../models/abstracts/entity-model';
import { useAppSharedContext } from '../../contexts/app-shared-context';
import { NotificationListDeletedModes } from '../../models/enums/notification-list-deleted-modes';

export const NotificationsPage = () => {
  const { getUserNotificationsAsync, getRequirementAsync, postNotificationAsync, postEntityAsync, deleteNotificationListAsync } = useAppDataContext();
  const [currentNotifications, setCurrentNotifications] = useState<NotificationModel[]>([]);
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRef = useRef<DataGrid<NotificationModel>>(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setNotificationCount } = useAppSharedContext();
  const deleteFilterContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);

  useEffect(() => {
    (async () => {
      const userNotifications = await getUserNotificationsAsync();
      const dataGridInstance = dataGridRef.current?.instance;

      if ((state as any) && (state as any).notificationId) {
        dataGridInstance!.option()!.focusedRowKey = (state as any).notificationId;
      }

      window.history.replaceState({}, '');

      if (userNotifications) {
        setCurrentNotifications(userNotifications!);
      }
    })();
  }, [getUserNotificationsAsync, state]);

  const onShowRequirementAsync = useCallback(async () => {
    const notificationId = dataGridRef.current?.instance.option('focusedRowKey');
    const notification = currentNotifications?.find(n => n.id === notificationId);

    if (!notification || !notification.requirementId) {

      return;
    }

    const requirementTemplate = await getRequirementAsync(notification.requirementId);
    const notificationRequirementTemplateId = requirementTemplate?.requirementTemplateId;
    const notificationRequirementId = notification.requirementId;
    await postNotificationAsync(notificationId);
    navigate(`/requirement/${notificationRequirementTemplateId}/${notificationRequirementId}/?review`);
  }, [currentNotifications, getRequirementAsync, navigate, postNotificationAsync]);

  const contextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <EyeIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Просмотр заявки',
        onClick: async () => {
          await onShowRequirementAsync();
        },
      },
      {
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить',
        onClick: async () => {
          const notificationId = dataGridRef.current?.instance.option('focusedRowKey');

          const deletedNotification = await postEntityAsync(
              {
                id: notificationId,
                isDeleted: true,
                isRead: true,
              } as EntityModel,
              {
                entityTypeName: 'Notification',
                updatedProperties: ['IsDeleted', 'IsRead']
              },
              true
          );

          if (deletedNotification) {
            setCurrentNotifications(prevState => prevState?.filter(n => n.id !== deletedNotification.id));
            notify('Уведомление успешно удалено', 'success', 3000);
            setNotificationCount(prevState => --prevState);
          }
        },
      },
    ];
  }, [onShowRequirementAsync, postEntityAsync, setNotificationCount]);

  const onDeleteNotificationListAsync = useCallback(async (mode: NotificationListDeletedModes) => {
    if (!currentNotifications.find(n => n.isRead)) {
      notify('У вас нет просмотренных уведомлений.', 'warning', 3000);

      return;
    }

    const deletedNotificationList = await deleteNotificationListAsync(mode);

    if (deletedNotificationList) {
      const updatedNotificationList = currentNotifications
        .filter(
          ({ id: firstId }) => !deletedNotificationList.some(({ id: secondId }) => secondId === firstId)
        );

      setCurrentNotifications(updatedNotificationList);

      notify('Уведомления были успешно удалены', 'success', 3000);
    }
  }, [currentNotifications, deleteNotificationListAsync]);
  
  const deleteFilterContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить просмотренные',
        items: [
          {
            icon: () => <DayIcon size={appConstants.appearance.hugeIconSize}
              color={appConstants.appearance.baseDarkGrey}/>,
            text: 'За день',
            onClick: async () => {
              await onDeleteNotificationListAsync(NotificationListDeletedModes.day);
            }
          },
          {
            icon: () => <WeekIcon size={appConstants.appearance.normalIconSize}
              color={appConstants.appearance.baseDarkGrey}/>,
            text: 'За неделю',
            onClick: async () => {
              await onDeleteNotificationListAsync(NotificationListDeletedModes.week);
            }
          },
          {
            icon: () => <MonthIcon size={appConstants.appearance.normalIconSize}
              color={appConstants.appearance.baseDarkGrey}/>,
            text: 'За месяц',
            onClick: async () => {
              await onDeleteNotificationListAsync(NotificationListDeletedModes.month);
            }
          },
          {
            icon: () => <ListIcon size={appConstants.appearance.hugeIconSize}
              color={appConstants.appearance.baseDarkGrey}/>,
            text: 'Все',
            onClick: async () => {
              await onDeleteNotificationListAsync(NotificationListDeletedModes.viewed);
            }
          }
        ]
      },
    ] as MenuItemModel[];
  }, [onDeleteNotificationListAsync]);

  return (
    <div className={'app-content-card'}>
      <Navbar>
        <div className={'navbar__item navbar__search'}>
          <AuthToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <NotificationToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <InstructionToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <CommonToolbar />
        </div>
      </Navbar>

      <div className={'app-card'}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <RequirementStateAgreedIcon size={22} />
          <span className={'data-grid-header'}>Уведомления</span>
        </div>

        <DataGrid
          ref={dataGridRef}
          className={'user-requirements app-data-grid'}
          dataSource={currentNotifications}
          focusedRowEnabled={true}
          allowColumnReordering={true}
          columnHidingEnabled={true}
          keyExpr={'id'}
          width={'100%'}
          height={'60vh'}
          onRowDblClick={async () => {
            await onShowRequirementAsync();
          }}
        >
          <Scrolling mode="standard" />
          <GroupPanel visible={true} />
          <SearchPanel width={300} visible={true} highlightCaseSensitive={true} />

          <Toolbar>
            <Item>
              <Button
                className={'app-command-button'}
                onClick={async e => {
                  if (deleteFilterContextMenuRef && deleteFilterContextMenuRef.current) {
                    deleteFilterContextMenuRef.current.instance.option('target', e.element);
                    await deleteFilterContextMenuRef.current.instance.show();
                  }
                }}>
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            </Item>
            <Item>
              
            </Item>
            <Item
              name={'groupPanel'}
              location="before" />
            <Item
              name={'searchPanel'}
              location="after" />
          </Toolbar>

          <Column type={'buttons'} width={60} cellRender={() => {
            return (
              <Button className={'app-command-button'} onClick={async e => {
                if (rowContextMenuRef && rowContextMenuRef.current) {
                  rowContextMenuRef.current.instance.option('target', e.element);
                  await rowContextMenuRef.current.instance.show();
                }
              }} >
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            );
          }}
          />
          <Column
            dataField='message'
            dataType='datetime'
            caption={'Сообщение'}
            cellRender={(item) => {
              return (
                <span dangerouslySetInnerHTML={{ __html: item.data.message }}></span>
              );
            }}
            minWidth={500}
            hidingPriority={3}
          />
          <Column
            allowSorting={true}
            sortOrder={'desc'}
            dataField='creationDate'
            dataType='datetime'
            width={200}
            caption={'Дата создания'}
            hidingPriority={2}
          />
          <Column
            dataField='isRead'
            caption={'Просмотрено'}
            hidingPriority={1}
            width={200}
            cellRender={(e) => {
              return (
                e.data.isRead ? <CheckmarkIcon title={'Просмотрено'} size={appConstants.appearance.bigIconSize} /> : null
              );
            }}
          />
          <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes} showPageSizeSelector={true} />
          <Paging defaultPageSize={10} />
        </DataGrid>

        <MainContextMenu ref={rowContextMenuRef} items={contextMenuItems} />
        <MainContextMenu ref={deleteFilterContextMenuRef} items={deleteFilterContextMenuItems} />
      </div>

    </div>
  );
};
