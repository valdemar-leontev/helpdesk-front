import {
  AddIcon,
  CategoryIcon,
  CheckmarkIcon,
  DeleteIcon,
  ExtensionVertIcon,
  PersonsIcon,
  RenameIcon,
  RequirementCategoryTypeIcon
} from '../../components/icons/icons';
import { Column } from 'devextreme-react/tree-list';
import { useAppDataContext } from '../../contexts/app-data-context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RequirementCategoryTreeItemModel } from '../../models/data/requirement-category-tree-item-model';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { Navbar } from '../../components/navbar/navbar';
import { DataGrid, Item, MasterDetail, Pager, Paging, SearchPanel, Toolbar } from 'devextreme-react/ui/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { appConstants } from '../../constants/app-constants';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { RequirementCategoryRecipientsView } from './requirement-category-recipients-view';
import notify from 'devextreme/ui/notify';
import { showConfirmDialog } from '../../utils/common-dialogs';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { EditRequirementCategoryDialogProps } from '../../models/dialogs/edit-requirement-category-dialog-props';
import { SubdivisionMembersDialogProps } from '../../models/dialogs/subdivision-members-dialog-props';
import { PromptDialogProps } from '../../models/dialogs/prompt-dialog-props';
import { v1 as uuid } from 'uuid';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';
import { useDictionaryHelper } from '../../utils/dictionary-helper';

export const RequirementCategoriesPage = () => {

  const { getRequirementCategoryTreeItemListAsync, deleteRequirementCategoryAsync, getProfileListAsync, getRequirementCategoryProfileListAsync, postRequirementCategoryProfileAsync } = useAppDataContext();
  const [requirementCategoryList, setRequirementCategoryList] = useState<RequirementCategoryTreeItemModel[] | null>();
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const toolbarContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRef = useRef<DataGrid<RequirementCategoryTreeItemModel>>(null);
  const { showDialog } = useCommonDialogsContext();
  const [refreshStateTag, setRefreshStateTag] = useState<string | undefined>();
  const { addNewDictionaryItem } = useDictionaryHelper();

  const getDataAsync = useCallback(async () => {
    const requirementCategories = await getRequirementCategoryTreeItemListAsync();

    setRequirementCategoryList(requirementCategories);
  }, [getRequirementCategoryTreeItemListAsync]);

  useEffect(() => {
    (async () => {
      await getDataAsync();
    })();
  }, [getDataAsync]);

  const toolbarContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <RequirementCategoryTypeIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Создать тип...',
        onClick: () => {
          showDialog('PromptDialog', {
            visible: true,
            title: 'Добавить тип',
            callback: async (value) => {
              await addNewDictionaryItem(value, 'RequirementCategoryType');
              notify('Тип был создан.', 'success', 3000);
            }
          } as PromptDialogProps);
        }
      },
      {
        icon: () => <AddIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Добавить категорию...',
        onClick: () => {
          showDialog('EditRequirementCategoryDialog', {
            visible: true,
            requirementCategory: {},
            callback: async () => {
              await getDataAsync();
            }
          } as EditRequirementCategoryDialogProps);
        }
      },
    ];
  }, [addNewDictionaryItem, getDataAsync, showDialog]);

  const treeViewContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <RenameIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Редактировать...',
        onClick: () => {
          const id = dataGridRef.current?.instance.option('focusedRowKey');
          const requirementCategory = requirementCategoryList?.find(c => c.id === id);

          if (requirementCategory) {
            showDialog('EditRequirementCategoryDialog', {
              visible: true,
              requirementCategory: requirementCategory,
              callback: async () => {
                await getDataAsync();
              }
            } as EditRequirementCategoryDialogProps);
          }
        }
      },
      {
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить',
        onClick: async () => {
          showConfirmDialog({
            title: appConstants.strings.confirm,
            iconColor: appConstants.appearance.baseDarkGrey,
            iconName: 'DeleteIcon',
            iconSize: appConstants.appearance.hugeIconSize,
            textRender: () => {
              return (
                <span>Действительно хотите удалить категорию?</span>
              );
            },
            callback: async (dialogResult?: boolean) => {
              if (!dialogResult) {
                return;
              }

              const id = dataGridRef.current?.instance.option('focusedRowKey');
              const deletingRequirementCategory = requirementCategoryList?.find(c => c.id === id);
              if (deletingRequirementCategory) {
                const deletedRequirementCategory = await deleteRequirementCategoryAsync(deletingRequirementCategory.id);

                if (deletedRequirementCategory) {
                  const updatedRequirementCategoryList = requirementCategoryList?.filter(c => c.id != id);
                  setRequirementCategoryList(updatedRequirementCategoryList);
                  notify('Категория была удалена', 'success', 3000);
                }
              }
            }
          });
        }
      },
      {
        icon: () => <PersonsIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Изменить состав...',
        onClick: async () => {
          const currentProfileListItems = await getProfileListAsync(null) ?? [];

          const requirementCategoryId = dataGridRef.current?.instance.option('focusedRowKey');
          const profiles = await getRequirementCategoryProfileListAsync(requirementCategoryId);
          const profilesKeys = profiles?.map(p => p.id);

          showDialog('SubdivisionMembersDialog', {
            visible: true,
            currentProfileListItems: currentProfileListItems,
            originalSelectedProfileKeys: profilesKeys,
            callback: async (updatedProfileListItems) => {
              const links = await postRequirementCategoryProfileAsync(updatedProfileListItems, requirementCategoryId);

              if (links) {
                setRefreshStateTag(uuid());
                notify('Список был обновлен.', 'success', 3000);
              }
            }
          } as SubdivisionMembersDialogProps);
        }
      },
    ];
  }, [deleteRequirementCategoryAsync, getDataAsync, getProfileListAsync, getRequirementCategoryProfileListAsync, postRequirementCategoryProfileAsync, requirementCategoryList, showDialog]);

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
          <CategoryIcon size={22} />
          <span className={'data-grid-header'}>Категории заявок</span>
        </div>

        <DataGrid
          ref={dataGridRef}
          className={'app-data-grid'}
          dataSource={requirementCategoryList}
          focusedRowEnabled={true}
          allowColumnReordering={true}
          columnHidingEnabled={true}
          keyExpr={'id'}
          width={'100%'}
          height={'95%'}
        >
          <Toolbar>
            <Item>
              <Button
                className={'app-command-button'}
                hint={'Открыть контекстное меню'}
                style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginRight: 20 }}
                onClick={async (e) => {

                  if (toolbarContextMenuRef && toolbarContextMenuRef.current) {
                    toolbarContextMenuRef.current.instance.option('target', e.element);
                    await toolbarContextMenuRef.current.instance.show();
                  }

                }}>
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

          <Column type={'buttons'} width={60} cellRender={() => {
            return (
              <Button className={'app-command-button'} onClick={async e => {
                if (rowContextMenuRef && rowContextMenuRef.current) {
                  rowContextMenuRef.current.instance.option('target', e.element);
                  await rowContextMenuRef.current.instance.show();
                }
              }}>
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            );
          }}
          />

          <Column
            dataField='requirementCategoryTypeDescription'
            dataType='string'
            caption={'Тип'}
            hidingPriority={3}
          />
          <Column
            dataField='requirementCategoryDescription'
            dataType='string'
            caption={'Наименование'}
            hidingPriority={2}
          />
          <Column
            dataField='hasAgreement'
            dataType='boolean'
            caption={'Согласование'}
            cellRender={(e) => {
              const rowData = e.row.data as RequirementCategoryTreeItemModel;

              return (
                rowData.hasAgreement ? <CheckmarkIcon size={appConstants.appearance.normalIconSize} /> : null
              );
            }}
            hidingPriority={1}
          />
          <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes} showPageSizeSelector={true} />
          <Paging defaultPageSize={10} />

          <MasterDetail
            enabled={true}
            render={(e) => {
              const requirementCategoryId = e.data.id;

              return (
                <>
                  <div style={{ display: 'flex', gap: 10, padding: 10, marginBottom: 10 }}>
                    <PersonsIcon size={22} />
                    <span style={{ fontSize: 14, color: 'black', fontWeight: 500 }}>Ответственная группа</span>
                  </div>

                  <RequirementCategoryRecipientsView requirementCategoryId={requirementCategoryId} refreshStateTag={refreshStateTag} />
                </>
              );
            }}
          />

        </DataGrid>

        <MainContextMenu ref={rowContextMenuRef} items={treeViewContextMenuItems} />
        <MainContextMenu ref={toolbarContextMenuRef} items={toolbarContextMenuItems} />
      </div>
    </div>
  );
};
