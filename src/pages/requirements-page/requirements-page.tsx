import './requirements-page.scss';
import {
  Column,
  DataGrid,
  Grouping,
  GroupPanel,
  Item,
  MasterDetail,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Toolbar
} from 'devextreme-react/ui/data-grid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { useAppDataContext } from '../../contexts/app-data-context';
import { RequirementModel } from '../../models/data/requirement-model';
import {
  AddIcon,
  ArchiveIcon,
  DeleteIcon,
  ExtensionVertIcon,
  EyeIcon,
  FilterIcon,
  RequirementIcon,
  RequirementStateClosedIcon,
  RequirementStateCompletedIcon,
  RequirementStateCreatedIcon,
  RequirementStateInExecutionIcon,
  RequirementStateRejectedIcon, ResetFilterIcon,
  RestoreIcon
} from '../../components/icons/icons';
import { Button } from 'devextreme-react/ui/button';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { DialogProps } from '../../models/dialogs/dialog-props';
import { appConstants } from '../../constants/app-constants';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import ContextMenu from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { showConfirmDialog } from '../../utils/common-dialogs';
import notify from 'devextreme/ui/notify';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { useLocation, useNavigate } from 'react-router';
import RequirementDetailStageView from './requirement-detail-stage-view/requirement-detail-stage-view';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';
import { useIconFactories } from '../../components/icons/use-icon-factories';
import { ClickEvent } from 'devextreme/ui/button';
import { RequirementStates } from '../../models/enums/requirement-states';
import { ItemClickEvent } from 'devextreme/ui/menu';

export const UserRequirementPage = () => {
  const { getRequirementListAsync, deleteRequirementAsync, postRequirementArchiveAsync, postRequirementStateAsync } = useAppDataContext();
  const { getAuthUser } = useAppAuthContext();
  const { showDialog } = useCommonDialogsContext();
  const dataGridRef = useRef<DataGrid<RequirementModel>>(null);
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const filterContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { RequirementStateIconFactory } = useIconFactories();
  const [archiveMode, setArchiveMode] = useState<boolean>(false);
  const [requirementList, setRequirementList] = useState<RequirementModel[]>([]);

  const getDataAsync = useCallback(async () => {
    const userRequirementList = await getRequirementListAsync();

    if (userRequirementList) {
      setRequirementList(userRequirementList.filter(r => r.isArchive === archiveMode));
      console.log(userRequirementList);
    }
  }, [archiveMode, getRequirementListAsync]);

  useEffect(() => {
    (async () => {
      await getDataAsync();

      if ((state as any) && (state as any).requirementId) {
        const dataGridInstance = dataGridRef.current!.instance;
        dataGridInstance.option().focusedRowKey = (state as any).requirementId;
        dataGridInstance.collapseAll(0);
      }

      window.history.replaceState({}, '');
    })();
  }, [getDataAsync, state]);

  const onToggleRequirementArchiveAsync = useCallback(async () => {
    const requirementId = dataGridRef.current?.instance.option('focusedRowKey');
    const requirementLinkProfile = await postRequirementArchiveAsync(requirementId);

    if(requirementLinkProfile) {
      const editedRequirement = requirementList.find(r => r.id === requirementId);

      if(editedRequirement) {
        setRequirementList(prevState => prevState.filter(r => r.id !== requirementId));
      }
    }
  }, [postRequirementArchiveAsync, requirementList]);

  const onDeleteRequirementAsync = useCallback(async () => {
    if (dataGridRef && dataGridRef.current) {
      const requirementId = dataGridRef.current.instance.option('focusedRowKey') as number;

      showConfirmDialog({
        title: appConstants.strings.confirm,
        iconColor: appConstants.appearance.baseDarkGrey,
        iconName: 'QuestionIcon',
        iconSize: appConstants.appearance.hugeIconSize,
        textRender: () => {
          return (
            <span>Удалить выбранную заявку?</span>
          );
        },
        callback: async (dialogResult?: boolean) => {
          if (!dialogResult) {
            return;
          }

          if (requirementId) {
            const deletedRequirement = await deleteRequirementAsync(requirementId);

            if (deletedRequirement) {
              setRequirementList(prevState => prevState.filter(r => r.id !== deletedRequirement.id));
              notify(appConstants.strings.requirementDeleted, 'success', 3000);
            }
          }
        }
      });
    }
  }, [deleteRequirementAsync]);

  const onShowGridRowContextMenuAsync = useCallback(async (e: ClickEvent) => {
    if (rowContextMenuRef && rowContextMenuRef.current) {
      rowContextMenuRef.current.instance.option('target', e.element);
      await rowContextMenuRef.current.instance.show();
    }
  }, []);

  const onShowRequirement = useCallback(() => {
    const requirementId = dataGridRef.current?.instance.option('focusedRowKey');
    const requirement = requirementList?.find(r => r.id === requirementId);

    if (requirement) {
      navigate(`/requirement/${requirement.requirementTemplateId}/${requirementId}/?review`);
    }
  }, [navigate, requirementList]);

  const onCompleteOrCloseRequirementAsync = useCallback(async (state: RequirementStates) => {
    const requirementId = dataGridRef.current?.instance.option('focusedRowKey');
    const requirement = requirementList?.find(r => r.id === requirementId);

    if (requirement) {
      const updatedRequirement = await postRequirementStateAsync(requirement.id, state, null);

      if (updatedRequirement) {
        notify('Заявка успешно переведена в состояние "Выполнена"', 'success', 3000);
        await getDataAsync();

        showConfirmDialog({
          title: appConstants.strings.confirm,
          iconColor: appConstants.appearance.baseDarkGrey,
          iconName: 'QuestionIcon',
          iconSize: appConstants.appearance.hugeIconSize,
          textRender: () => {
            return (
              <span>Перевести заявку в архив?</span>
            );
          },
          callback: async (dialogResult?: boolean) => {
            if (!dialogResult) {
              return;
            }

            await onToggleRequirementArchiveAsync();
          }
        });
      }
    }
  }, [getDataAsync, onToggleRequirementArchiveAsync, postRequirementStateAsync, requirementList]);

  const dataGridContextMenuItems = useMemo(() => {
    return [
      {
        text: 'Просмотр',
        icon: () => <EyeIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          onShowRequirement();
        }
      },
      {
        name: 'delete',
        text: appConstants.strings.delete,
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onDeleteRequirementAsync();
        }
      },
      {
        visible: !archiveMode,
        text: 'Архивировать',
        icon: () => <ArchiveIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onToggleRequirementArchiveAsync();
        }
      },
      {
        visible: archiveMode,
        text: 'Востановить',
        icon: () => <RestoreIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onToggleRequirementArchiveAsync();
        }
      },
      {
        name: 'complete',
        text: 'Выполнена',
        icon: () => <RequirementStateCompletedIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onCompleteOrCloseRequirementAsync(RequirementStates.completed);
        }
      },
      {
        name: 'close',
        text: 'Закрыта',
        icon: () => <RequirementStateClosedIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onCompleteOrCloseRequirementAsync(RequirementStates.closed);
        }
      }
    ] as MenuItemModel[];
  }, [archiveMode, onCompleteOrCloseRequirementAsync, onDeleteRequirementAsync, onShowRequirement, onToggleRequirementArchiveAsync]);

  const onChangeFilter = useCallback((e: ItemClickEvent, requirementState: RequirementStates) => {
    const dataGridInstance = dataGridRef.current!.instance;
    dataGridInstance.filter(['requirementStateId', '=', requirementState]);
  }, []);

  const filterContextMenuItems = useMemo(() => {
    return [
      {
        text: 'Фильтры',
        icon: () => <FilterIcon size={appConstants.appearance.normalIconSize} />,
        items: [
          {
            text: 'Без фильтра',
            icon: () => <ResetFilterIcon size={appConstants.appearance.normalIconSize} />,
            onClick: () => {
              const dataGridInstance = dataGridRef.current!.instance;
              dataGridInstance.clearFilter();
            },
            isSelectable: true
          },
          {
            beginGroup: true,
            text: 'Создана',
            icon: () => <RequirementStateCreatedIcon size={appConstants.appearance.normalIconSize} />,
            onClick: (e) => {
              onChangeFilter(e, RequirementStates.created);
            },
            isSelectable: true
          },
          {
            text: 'В исполнении',
            icon: () => <RequirementStateInExecutionIcon size={appConstants.appearance.normalIconSize} />,
            onClick: (e) => {
              onChangeFilter(e, RequirementStates.inExecution);
            },
            isSelectable: true
          },
          {
            text: 'Отказана',
            icon: () => <RequirementStateRejectedIcon size={appConstants.appearance.normalIconSize} />,
            onClick: (e) => {
              onChangeFilter(e, RequirementStates.rejected);
            },
            isSelectable: true
          },
          {
            text: 'Выполнена',
            icon: () => <RequirementStateCompletedIcon size={appConstants.appearance.normalIconSize} />,
            onClick: (e) => {
              onChangeFilter(e, RequirementStates.completed);
            },
            isSelectable: true
          },
          {
            text: 'Закрыта',
            icon: () => <RequirementStateClosedIcon size={appConstants.appearance.normalIconSize} />,
            onClick: (e) => {
              onChangeFilter(e, RequirementStates.closed);
            },
            isSelectable: true
          },
        ]
      },
      {
        text: archiveMode ? 'Активные заявки' : 'Архив',
        icon: () => archiveMode ? <RequirementIcon size={appConstants.appearance.normalIconSize} /> : <ArchiveIcon size={appConstants.appearance.normalIconSize} />,
        onClick: () => {
          setArchiveMode(prevState => !prevState);
        }
      }
    ] as MenuItemModel[];
  }, [archiveMode, onChangeFilter]);

  return (
    <div className={'app-content-card'}>
      <Navbar>
        <div className='navbar__item navbar__search'>
          <AuthToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <NotificationToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <InstructionToolbar />
        </div>
        <div className='navbar__item navbar__search'>
          <CommonToolbar />
        </div>
      </Navbar>

      <div className={'app-card'}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <RequirementIcon style={ archiveMode ? { display: 'none' } : {} } size={22} />
          <ArchiveIcon style={ !archiveMode ? { display: 'none' } : {} } size={22} />
          <span className={'data-grid-header'}>{archiveMode ? 'Архив' : 'Заявки'}</span>
        </div>

        <DataGrid
          ref={dataGridRef}
          className={'user-requirements app-data-grid'}
          dataSource={ requirementList }
          focusedRowEnabled={true}
          allowColumnReordering={true}  
          columnHidingEnabled={true}
          keyExpr={'id'}
          height={'60vh'}
          onRowDblClick={(e) => {
            const requirementTemplateId = (e.data as RequirementModel).requirementTemplateId;
            const requirementId = (e.data as RequirementModel).id;

            if (requirementTemplateId && requirementId) {
              navigate(`/requirement/${requirementTemplateId}/${requirementId}/?review`);
            }
          }}
        >
          <Scrolling mode="standard" />
          <GroupPanel visible={true} />
          <Toolbar>
            <Item>
              <Button type={'default'} className={'app-command-button'}
                hint={'Создать заявку'}
                onClick={() => showDialog('RequirementTemplateListDialog', { visible: true } as DialogProps)}>
                <AddIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            </Item>
            <Item>

              <Button className={'app-command-button'} onClick={async e => {
                if (filterContextMenuRef && filterContextMenuRef.current) {
                  filterContextMenuRef.current.instance.option('target', e.element);
                  await filterContextMenuRef.current.instance.show();
                }
              }} >
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
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
              <Button className={'app-command-button'}
                onClick={onShowGridRowContextMenuAsync}>
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            );
          }} />
          <Column
            cellRender={(e) => {
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <RequirementIcon title={'Заявка'} size={appConstants.appearance.normalIconSize} />
                  <ArchiveIcon  style={ archiveMode ? {} : { display: 'none' }} title={'В архиве'} size={appConstants.appearance.normalIconSize} />
                  <span style={{ marginLeft: 30 }}>{e.data.name}</span>
                </div>
              );
            }}
            hidingPriority={2}
            dataField='name'
            dataType='string'
            caption={'Наименование'} />
          <Column
            hidingPriority={2}
            dataField='userName'
            dataType='string'
            caption={'Отправитель'}
            width={250}
          />
          <Column
            allowSorting={true}
            sortOrder={'desc'}
            hidingPriority={1}
            dataField='creationDate'
            dataType='datetime'
            caption={'Дата создания'} />
          <Column
            cellRender={(e) => {
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                  {RequirementStateIconFactory(e.data.requirementStateId)}
                  <span><b>{e.data.requirementStateDescription}</b> ({e.data.lastStageProfileName})</span>
                </div>
              );
            }}
            hidingPriority={1}
            dataField='requirementStateDescription'
            dataType='string'
            caption={'Состояние'} />

          <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes}
            showPageSizeSelector={true} />
          <Paging defaultPageSize={10} />

          <MasterDetail
            enabled={true}
            render={(e) => {
              const requirementId = e.data.id;

              return (
                <RequirementDetailStageView requirementId={requirementId} />
              );
            }}
          />
        </DataGrid>

        <MainContextMenu
          onShowing={(e) => {
            const requirementId = dataGridRef.current?.instance.option('focusedRowKey');
            const requirement = requirementList.find(r => r.id === requirementId);

            if (!requirement) {

              return;
            }

            const items = e.component.instance().option('items') as MenuItemModel[];

            const isOwnedRequirement = requirement && requirement.profileId === getAuthUser()?.profileId;

            const completedItem = items!.find(i => i.name === 'complete');
            if (completedItem) {
              completedItem.visible = requirement.requirementStateId !== RequirementStates.completed && requirement.requirementStateId === RequirementStates.inExecution && !isOwnedRequirement;
            }

            const deleteItem = items!.find(i => i.name === 'delete');
            if (deleteItem) {
              deleteItem.visible = requirement.requirementStateId === RequirementStates.created && isOwnedRequirement;
            }

            const closeItem = items!.find(i => i.name === 'close');
            if (closeItem) {
              closeItem.visible = requirement.requirementStateId !== RequirementStates.closed && requirement.requirementStateId === RequirementStates.completed && isOwnedRequirement;
            }
          }}
          ref={rowContextMenuRef}
          items={dataGridContextMenuItems} />

        <MainContextMenu
          ref={filterContextMenuRef}
          items={filterContextMenuItems}
        />
      </div>
    </div>
  );
};
