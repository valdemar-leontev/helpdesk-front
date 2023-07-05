import notify from 'devextreme/ui/notify';
import { useAppDataContext } from '../../contexts/app-data-context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { Navbar } from '../../components/navbar/navbar';
import { TreeView } from 'devextreme-react/ui/tree-view';
import { OrganizationTreeItemModel } from '../../models/data/organization-tree-item-model';
import {
  Column,
  DataGrid,
  Grouping,
  GroupPanel,
  Item,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Toolbar
} from 'devextreme-react/ui/data-grid';
import {
  SubtreeIcon,
  DataGridIcon,
  DeleteIcon,
  ExtensionVertIcon,
  PersonsIcon,
  RenameIcon,
  TreeIcon,
  AddIcon,
  DisconnectIcon, SubdivisionHeadIcon, ExclamationIcon
} from '../../components/icons/icons';
import { ProfileListItemModel } from '../../models/data/profile-list-item-model';
import { Button } from 'devextreme-react/ui/button';
import { appConstants } from '../../constants/app-constants';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { SubdivisionMembersDialogProps } from '../../models/dialogs/subdivision-members-dialog-props';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { PromptDialogProps } from '../../models/dialogs/prompt-dialog-props';
import { DictionaryBaseModel } from '../../models/abstracts/dictionary-base-model';
import { showConfirmDialog } from '../../utils/common-dialogs';
import { EditProfileDialogProps } from '../../models/dialogs/edit-profile-dialog-props';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';

export const OrganizationTreePage = () => {
  const {
    getOrganizationTreeAsync,
    getProfileListAsync,
    deleteSubdivisionAsync,
    renameSubdivisionAsync,
    deleteSubdivisionProfileAsync,
    postAssignSubdivisionHeadAsync,
    postSubdivisionMembersAsync
  } = useAppDataContext();
  const [organizationTree, setOrganizationTree] = useState<OrganizationTreeItemModel[] | null>([]);
  const dataGridRef = useRef<DataGrid<ProfileListItemModel>>(null);
  const treeViewRef = useRef<TreeView<OrganizationTreeItemModel>>(null);
  const { showDialog } = useCommonDialogsContext();
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const { putSubdivisionAsync } = useAppDataContext();
  const [currentSubdivisionProfileList, setCurrentSubdivisionProfileList] = useState<ProfileListItemModel[] | null>([]);
  const [isVisibleOrganizationTree, setIsVisibleOrganizationTree] = useState<boolean>(false);
  const [currentSubdivisionId, setCurrentSubdivisionId] = useState<number | null>(null);
  const [previousSubdivisionId, setPreviousSubdivisionId] = useState<number | null>(null);

  const getOrganizationTreeDataAsync = useCallback(async () => {
    const organizationTree = await getOrganizationTreeAsync();
    if (organizationTree) {
      setOrganizationTree(organizationTree);
    }
  }, [getOrganizationTreeAsync]);

  const getProfileListDataAsync = useCallback(async (subdivisionId: number | null) => {
    const currentProfileList = await getProfileListAsync(subdivisionId);

    if (currentProfileList) {
      setCurrentSubdivisionProfileList(currentProfileList);
    }
  }, [getProfileListAsync]);

  useEffect(() => {
    (async () => {
      await getOrganizationTreeDataAsync();
      await getProfileListDataAsync(null);
    })();
  }, [getOrganizationTreeDataAsync, getProfileListDataAsync]);

  const onToggleModeAsync = useCallback(async () => {
    if (currentSubdivisionId) {
      setPreviousSubdivisionId(currentSubdivisionId);
      setCurrentSubdivisionId(null);
      await getProfileListDataAsync(null);
    } else {
      setCurrentSubdivisionId(previousSubdivisionId);
      await getProfileListDataAsync(previousSubdivisionId);
    }

    setIsVisibleOrganizationTree(prevState => !prevState);
  }, [currentSubdivisionId, getProfileListDataAsync, previousSubdivisionId]);

  const onShowEditProfileDialog = useCallback(() => {
    const userId = dataGridRef.current?.instance.option('focusedRowKey');
    const currentProfile = currentSubdivisionProfileList?.find(p => p.userId === userId);

    if (currentProfile) {
      showDialog('EditProfileDialog', {
        visible: true,
        editMode: true,
        userId: currentProfile.userId,
        callback: async () => {
          await getProfileListDataAsync(currentSubdivisionId);
        }
      } as EditProfileDialogProps);
    }
  }, [currentSubdivisionId, currentSubdivisionProfileList, getProfileListDataAsync, showDialog]);

  const onShowSubdivisionMembersDialog = useCallback(async (subdivisionId: number | null) => {
    const currentProfileList = await getProfileListAsync(null);
    const originalSelectedProfileKeys = currentProfileList!.filter(p => p.subdivisionId === subdivisionId).map(p => p.id);

    if (!currentProfileList) {
      return;
    }

    showDialog('SubdivisionMembersDialog', {
      visible: true,
      currentProfileListItems: currentProfileList.sort(p => !(p.subdivisionId === subdivisionId) ? 1 : -1),
      originalSelectedProfileKeys: originalSelectedProfileKeys,
      callback: async (updatedProfileListItems: ProfileListItemModel[]) => {

        let originalSelectedProfileListItems = [...currentProfileList.filter(p => originalSelectedProfileKeys.includes(p.id))];

        for (const originalSelectedProfile of originalSelectedProfileListItems) {
          const updatedProfile = updatedProfileListItems.find(p => p.userId === originalSelectedProfile.userId);
          if (!updatedProfile) {
            originalSelectedProfile.subdivisionId = null;
          }
        }
        for (const updatedProfile of updatedProfileListItems) {
          updatedProfile.subdivisionId = subdivisionId;
          const originalSelectedProfile = originalSelectedProfileListItems.find(p => p.userId === updatedProfile.userId);

          if (!originalSelectedProfile) {
            originalSelectedProfileListItems.push(updatedProfile);
          } else {
            originalSelectedProfileListItems = originalSelectedProfileListItems.filter(p => p.userId !== updatedProfile.userId);
          }
        }

        const profileList = await postSubdivisionMembersAsync(originalSelectedProfileListItems);

        if (profileList) {
          notify('Группа успешно обновлена.', 'success', 3000);

          await getProfileListDataAsync(currentSubdivisionId);
        }
      }
    } as SubdivisionMembersDialogProps);
  }, [currentSubdivisionId, getProfileListAsync, getProfileListDataAsync, postSubdivisionMembersAsync, showDialog]);

  const onDeleteSubdivisionProfile = useCallback(() => {
    showConfirmDialog({
      title: appConstants.strings.deleting,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'DeleteIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите удалить пользователя из подразделения?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const userId = dataGridRef.current?.instance.option('focusedRowKey');
        const profile = currentSubdivisionProfileList?.find(p => p.userId === userId);
        if (profile && profile.id !== 0) {
          const profileLinkSubdivision = await deleteSubdivisionProfileAsync(profile.id);

          if (profileLinkSubdivision) {
            const updatedProfileList = currentSubdivisionProfileList?.filter(p => p.id !== profile.id);
            setCurrentSubdivisionProfileList(updatedProfileList!);
            notify('Пользователь был удален из подразделения.', 'success', 3000);
          }
        }
      }
    });

  }, [currentSubdivisionProfileList, deleteSubdivisionProfileAsync]);

  const onAssignSubdivisionHead = useCallback(() => {
    showConfirmDialog({
      title: 'Назначить руководителем',
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'SubdivisionHeadIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите назначить руководителем подразделения?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }
        const userId = dataGridRef.current?.instance.option('focusedRowKey');
        const currentProfile = currentSubdivisionProfileList?.find(p => p.userId === userId);
        const profileLinkSubdivision = await postAssignSubdivisionHeadAsync(currentProfile!.id);

        if (profileLinkSubdivision) {
          await getProfileListDataAsync(currentSubdivisionId);
          notify('Руководитель подразделения был назначен.', 'success', 3000);
        }
      }
    });
  }, [currentSubdivisionId, currentSubdivisionProfileList, getProfileListDataAsync, postAssignSubdivisionHeadAsync]);

  const treeViewContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <AddIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Добавить...',
        onClick: () => {
          showDialog('PromptDialog', {
            visible: true,
            title: 'Добавить подразделение',
            callback: async (subdivisionDescription) => {
              const subdivision = {
                description: subdivisionDescription
              } as DictionaryBaseModel;
              const parentSubdivisionId = (rowContextMenuRef.current!.instance as any).treeItem.id;
              const newSubdivision = await putSubdivisionAsync(subdivision, parentSubdivisionId);

              if (newSubdivision) {
                const subdivisionItem = {
                  id: newSubdivision.subdivisionId,
                  description: subdivisionDescription,
                  parentId: parentSubdivisionId
                } as OrganizationTreeItemModel;

                if (subdivisionItem) {
                  const updatedTree = [...organizationTree!, subdivisionItem];
                  setOrganizationTree(updatedTree);
                  notify('Подразделение было добавлено', 'success', 3000);
                }
              }
            }
          } as PromptDialogProps);
        }
      },
      {
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить...',
        onClick: () => {
          showConfirmDialog({
            title: appConstants.strings.deleting,
            iconColor: appConstants.appearance.baseDarkGrey,
            iconName: 'DeleteIcon',
            iconSize: appConstants.appearance.hugeIconSize,
            textRender: () => {
              return (
                <span>Действительно хотите удалить подразделение?</span>
              );
            },
            callback: async (dialogResult?: boolean) => {
              if (!dialogResult) {
                return;
              }

              const subdivisionId = (rowContextMenuRef.current!.instance as any).treeItem.id;
              const subdivision = await deleteSubdivisionAsync(subdivisionId);

              if (subdivision) {
                const updatedTree = organizationTree?.filter(t => t.id !== subdivision.id);
                if (updatedTree) {
                  setOrganizationTree(updatedTree);
                  notify('Подразделение было удалено', 'success', 3000);
                }
              }
            }
          });
        }
      },
      {
        icon: () => <RenameIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Переименовать...',
        onClick: () => {
          const subdivisionId = (rowContextMenuRef.current!.instance as any).treeItem.id;
          showDialog('PromptDialog', {
            visible: true,
            title: 'Переименовать',
            initialValue: organizationTree?.find(o => o.id === subdivisionId)!.description,
            callback: async (newSubdivisionDescription) => {
              const subdivision = await renameSubdivisionAsync(subdivisionId, newSubdivisionDescription);
              if (subdivision) {
                const updatedSubdivision = organizationTree?.find(o => o.id === subdivisionId);
                if (updatedSubdivision) {
                  updatedSubdivision.description = newSubdivisionDescription;
                  notify('Подразделение было переименовано.', 'success', 3000);
                }
              }
            }
          } as PromptDialogProps);
        }
      },
      {
        icon: () => <PersonsIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Изменить состав...',
        onClick: async () => {
          const subdivisionId = (rowContextMenuRef.current!.instance as any).treeItem.id;
          await onShowSubdivisionMembersDialog(subdivisionId);
        }
      },

    ];
  }, [deleteSubdivisionAsync, onShowSubdivisionMembersDialog, organizationTree, putSubdivisionAsync, renameSubdivisionAsync, showDialog]);

  const dataGridContextMenuItems = useMemo(() => {

    return [
      {
        icon: () => <RenameIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Редактировать...',
        onClick: () => {
          onShowEditProfileDialog();
        }
      },
      {
        icon: () => <DisconnectIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Отсоединить',
        visible: isVisibleOrganizationTree && currentSubdivisionId !== null,
        onClick: () => {
          onDeleteSubdivisionProfile();
        }
      },
      {
        icon: () => <SubdivisionHeadIcon size={appConstants.appearance.normalIconSize}
          color={appConstants.appearance.baseDarkGrey} />,
        text: 'Назначить руководителем',
        visible: isVisibleOrganizationTree && currentSubdivisionId !== null,
        onClick: () => {
          onAssignSubdivisionHead();
        }
      }
    ];
  }, [currentSubdivisionId, isVisibleOrganizationTree, onAssignSubdivisionHead, onDeleteSubdivisionProfile, onShowEditProfileDialog]);

  return (
    <div className={'app-content-card organization-tree-page'}>
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
          <TreeIcon size={22} />
          <span className={'data-grid-header'}>Организационное дерево</span>
        </div>

        {
          organizationTree
            ? <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 20,
              height: '100%',
              marginTop: 20,
              width: '100%'
            }}>
              <div style={{
                display: isVisibleOrganizationTree ? 'flex' : 'none',
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 300
              }}>
                <TreeView
                  ref={treeViewRef}
                  visible={isVisibleOrganizationTree}
                  className={'app-tree-view'}
                  keyExpr={'id'}
                  searchEnabled={true}
                  items={organizationTree!}
                  focusStateEnabled={false}
                  selectionMode={'single'}
                  dataStructure={'plain'}
                  displayExpr={'description'}
                  parentIdExpr={'parentId'}
                  searchExpr={'description'}
                  width={'100%'}
                  height={'95%'}
                  scrollDirection={'both'}
                  onItemClick={async (e) => {
                    if (e.itemData) {
                      e.component.selectItem(e.itemData);

                      const subdivisionId = e.itemData.id as number;
                      setCurrentSubdivisionId(subdivisionId);
                      await getProfileListDataAsync(subdivisionId);
                    }
                  }}
                  itemRender={(treeItem) => {
                    return (
                      <div key={treeItem.id} className={'app-row-space-between'}>
                        <span>{treeItem.description}</span>
                        <Button className={'app-command-button'} onClick={async e => {
                          e.event!.stopPropagation();
                          if (rowContextMenuRef && rowContextMenuRef.current) {
                            rowContextMenuRef.current.instance.option('target', e.element);
                            (rowContextMenuRef.current.instance as any).treeItem = treeItem;
                            await rowContextMenuRef.current.instance.show();
                          }
                        }}>
                          <ExtensionVertIcon size={appConstants.appearance.smallIconSize} />
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>

              <div style={{
                borderRight: '1px solid #c4c4c4',
                height: '100%',
                display: isVisibleOrganizationTree ? 'flex' : 'none'
              }} />

              <div style={{ display: 'flex', flex: 1 }}>
                <DataGrid
                  ref={dataGridRef}
                  className={'app-data-grid'}
                  dataSource={currentSubdivisionProfileList}
                  focusedRowEnabled={true}
                  allowColumnReordering={true}
                  columnHidingEnabled={true}
                  keyExpr={'userId'}
                  allowColumnResizing={true}
                  columnResizingMode={'nextColumn'}
                  height={'95%'}
                >
                  <Scrolling mode="standard" />
                  <GroupPanel visible={true} />
                  <Toolbar>

                    <Item visible={isVisibleOrganizationTree}>
                      <Button
                        className={'app-command-button'}
                        hint={'Скрыть организационное дерево'}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                          marginRight: 20
                        }}
                        onClick={onToggleModeAsync}
                      >
                        <DataGridIcon size={appConstants.appearance.normalIconSize} />
                      </Button>
                    </Item>

                    <Item visible={!isVisibleOrganizationTree}>
                      <Button
                        className={'app-command-button'}
                        hint={'Показать организационное дерево'}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                          marginRight: 20
                        }}
                        onClick={onToggleModeAsync}
                      >
                        <SubtreeIcon size={appConstants.appearance.normalIconSize} />
                      </Button>
                    </Item>

                    <Item>
                      <Button
                        className={'app-command-button'}
                        hint={'Состав подразделения'}
                        disabled={currentSubdivisionId === null || !isVisibleOrganizationTree}
                        onClick={async () => {
                          setPreviousSubdivisionId(currentSubdivisionId);
                          await onShowSubdivisionMembersDialog(currentSubdivisionId);
                        }}>
                        <PersonsIcon size={appConstants.appearance.normalIconSize} />
                      </Button>
                    </Item>
                    <Item
                      name={'groupPanel'}
                      location="before" />
                    <Item
                      name={'searchPanel'}
                      location="after" />
                  </Toolbar>

                  <SearchPanel width={300} visible={true} highlightCaseSensitive={true} />
                  <Grouping autoExpandAll={false} />

                  <Column type={'buttons'} width={60} cellRender={() => {
                    return (
                      <Button className={'app-command-button'} onClick={async e => {
                        if (dataGridRowContextMenuRef && dataGridRowContextMenuRef.current) {
                          dataGridRowContextMenuRef.current.instance.option('target', e.element);
                          await dataGridRowContextMenuRef.current.instance.show();
                        }
                      }}>
                        <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
                      </Button>
                    );
                  }}
                  />

                  <Column
                    hidingPriority={7}
                    dataField='hasProfile'
                    dataType='boolean'
                    caption={'Профиль'}
                    width={100}
                    alignment={'center'}
                    cellRender={(e) => {
                      if (e.data.isHead) {
                        return (
                          <div style={{ display: 'flex', gap: 10, justifyContent: 'start' }}>
                            {e.data.hasProfile
                              ? null
                              : <ExclamationIcon title={'Профиль не заполнен'}
                                size={appConstants.appearance.smallIconSize} />}
                            <SubdivisionHeadIcon title={'Глава подразделения'}
                              size={appConstants.appearance.normalIconSize} />
                          </div>
                        );
                      } else {
                        return e.data.hasProfile
                          ? null
                          :
                          <div style={{ display: 'flex', gap: 10, justifyContent: 'start' }}>
                            <ExclamationIcon title={'Профиль не заполнен'}
                              size={appConstants.appearance.smallIconSize} />
                          </div>;
                      }
                    }} />

                  <Column
                    hidingPriority={6}
                    dataField='firstName'
                    dataType='string'
                    caption={'Имя'}
                    width={130} />
                  <Column
                    hidingPriority={5}
                    dataField='lastName'
                    dataType='string'
                    caption={'Фамилия'}
                    width={130} />
                  <Column
                    hidingPriority={4}
                    dataField='subdivisionName'
                    dataType='string'
                    caption={'Подразделение'} width={200} />
                  <Column
                    hidingPriority={3}
                    dataField='positionName'
                    dataType='string'
                    caption={'Должность'} width={250} />
                  <Column
                    hidingPriority={2}
                    dataField='userName'
                    dataType='string'
                    caption={'Логин'}
                  />
                  <Column
                    hidingPriority={1}
                    dataField='email'
                    dataType='string'
                    caption={'Почта'} />

                  <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes}
                    showPageSizeSelector={true} />
                  <Paging defaultPageSize={25} />
                </DataGrid>
              </div>

              <MainContextMenu ref={rowContextMenuRef} items={treeViewContextMenuItems} />
              <MainContextMenu ref={dataGridRowContextMenuRef} items={dataGridContextMenuItems} />
            </div>
            : null
        }
      </div>
    </div>
  );
};
