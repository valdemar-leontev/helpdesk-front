import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Column, DataGrid, GroupPanel, Item, Paging, Scrolling, Toolbar } from 'devextreme-react/ui/data-grid';
import { Button } from 'devextreme-react/ui/button';
import {
  DeleteIcon,
  ExtensionVertIcon,
  EyeIcon,
  FileUploadIcon,
  GroupIcon,
  ProfileIcon,
  ReplaceIcon,
  RequirementIcon
} from '../../components/icons/icons';
import { appConstants } from '../../constants/app-constants';
import { showConfirmDialog } from '../../utils/common-dialogs';
import notify from 'devextreme/ui/notify';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { FileModel } from '../../models/data/file-model';
import { useAppDataContext } from '../../contexts/app-data-context';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { FileListDataGridProps } from '../../models/components/file-list-data-grid-props';
import { Pager, SearchPanel } from 'devextreme-react/data-grid';
import { ItemClickEvent } from 'devextreme/ui/menu';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { FileUploadDialogProps } from '../../models/dialogs/file-upload-dialog-props';
import { FileAttachmentModes } from '../../models/enums/file-attachment-modes';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { FileListDataGridViewModes } from '../../models/enums/file-list-data-grid-view-modes';

export const FileListDataGrid = ({ requirementId, fileDeletedCallback, mode }:  FileListDataGridProps) => {
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRef = useRef<DataGrid<FileModel>>(null);
  const groupContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const { deleteFileAsync, downloadFileAsync, getFileListAsync } = useAppDataContext();
  const [fileList, setFileList] = useState<FileModel[]>([]);
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();

  const getDataAsync = useCallback(async () => {
    const files = await getFileListAsync(requirementId);

    if (files) {
      setFileList(files);
    }
  }, [getFileListAsync, requirementId]);

  useEffect(() => {
    (async () => {
      await getDataAsync();
    })();
  }, [getDataAsync]);

  const onShowOrDownloadFileAsync = useCallback(async () => {
    const fileId = dataGridRef.current?.instance.option('focusedRowKey');
    const currentFile = fileList?.find(f => f.id === fileId);

    if (currentFile) {
      await downloadFileAsync(currentFile.uid, true);
    }
  }, [downloadFileAsync, fileList]);

  const onDeleteFileAsync = useCallback(() => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'DeleteIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Вы уверены, что хотите удалить файл?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const fileId = dataGridRef.current?.instance.option('focusedRowKey');
        const currentFile = fileList?.find(f => f.id === fileId);

        if (currentFile) {
          const deletedFile = await deleteFileAsync(currentFile.id);

          if (deletedFile) {
            setFileList(prevState => prevState.filter(f => f.id !== deletedFile.id));

            if (fileDeletedCallback) {
              fileDeletedCallback();
            }

            notify('Файл был успешно удален.', 'success', 3000);
          }
        }
      }
    });
  }, [deleteFileAsync, fileDeletedCallback, fileList]);

  const contextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <EyeIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Просмотреть файл',
        visible: true,
        onClick: async () => {
          await onShowOrDownloadFileAsync();
        }
      },
      {
        name: 'delete',
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить',
        onClick: async () => {
          await onDeleteFileAsync();
        }
      },
      {
        name: 'replace',
        icon: () => <ReplaceIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Заменить',
        onClick: async () => {
          const fileId = dataGridRef.current?.instance.option('focusedRowKey');
          const currentFile = fileList.find(f => f.id === fileId);

          if(currentFile) {
            showDialog('FileUploadDialog', {
              visible: true,
              mode: FileAttachmentModes.replace,
              fileUid: currentFile.uid,
              fileUploadedCallback: async () => {
                await getDataAsync();
              }
            } as FileUploadDialogProps);
          }
        }
      },
    ];
  }, [fileList, getDataAsync, onDeleteFileAsync, onShowOrDownloadFileAsync, showDialog]);

  const onChangeGroupMode = useCallback((e: ItemClickEvent, groupName: string) => {
    const dataGridInstance = dataGridRef.current!.instance;
    dataGridInstance.clearGrouping();
    dataGridInstance.columnOption(groupName, 'groupIndex', 0);
    dataGridInstance.collapseAll(0);
  }, []);

  const onWithoutGroup = useCallback(() => {
    const dataGridInstance = dataGridRef.current!.instance;

    dataGridInstance.clearGrouping();
  }, []);

  const groupContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <GroupIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Группа',
        visible: true,
        items: [
          {
            icon: () => <RequirementIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
            text: 'Без группы',
            onClick: async () => {
              onWithoutGroup();
            },
            isSelectable: true
          },
          {
            beginGroup: true,
            icon: () => <ProfileIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
            text: 'Пользователь',
            onClick: async (e) => {
              onChangeGroupMode(e, 'userName');
            },
            isSelectable: true
          },
          {
            icon: () => <RequirementIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
            text: 'Заявка',
            onClick: async (e) => {
              onChangeGroupMode(e, 'requirementName');
            },
            isSelectable: true
          }
        ]
      },
      {
        icon: () => <FileUploadIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Загрузить файлы',
        onClick: async () => {
          showDialog('FileUploadDialog', {
            visible: true,
            mode: FileAttachmentModes.simple,
            fileListUploadedCallback: async () => {
              await getDataAsync();
            } } as FileUploadDialogProps);
        }
      }
    ] as MenuItemModel[];
  }, [getDataAsync, onChangeGroupMode, onWithoutGroup, showDialog]);

  return (
    <div>
      <DataGrid
        onRowDblClick={async () => {
          await onShowOrDownloadFileAsync();
        }}
        ref={dataGridRef}
        className={'app-data-grid'}
        dataSource={fileList}
        focusedRowEnabled={true}
        keyExpr={'id'}
        width={'100%'}
        height={'60vh'}
      >
        <Scrolling mode="standard" />

        <GroupPanel visible={!requirementId} />
        <SearchPanel width={300} visible={!requirementId} highlightCaseSensitive={true} />

        <Toolbar visible={!requirementId}>
          <Item>
            <Button className={'app-command-button'}
              onClick={async e => {
                if (groupContextMenuRef && groupContextMenuRef.current) {
                  groupContextMenuRef.current.instance.option('target', e.element);
                  await groupContextMenuRef.current.instance.show();
                }
              }}
            >
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

        <Column type={'buttons'} width={70} cellRender={() => {
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
          caption={'Имя'}
          dataField={'name'}
          dataType={'string'}
          width={400}
        />

        <Column
          visible={!requirementId}
          caption={'Пользователь'}
          dataField={'userName'}
          dataType={'string'}/>

        <Column
          visible={!requirementId}
          caption={'Заявка'}
          dataField={'requirementName'}
          dataType={'string'} />

        <Column
          visible={!requirementId}
          caption={'Дата создания'}
          dataField={'creationDate'}
          dataType={'datetime'}
          width={150}
          alignment={'center'} />

        <Column
          alignment={'center'}
          caption={'Размер (кБ)'}
          dataField={'size'}
          dataType={'string'}
        />

        <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes}
          showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>

      <MainContextMenu
        ref={rowContextMenuRef}
        onShowing={(e) => {
          const fileId = dataGridRef.current?.instance.option('focusedRowKey');
          const file = fileList.find(f => f.id === fileId);

          if (!file) {

            return;
          }

          const items = e.component.instance().option('items') as MenuItemModel[];
          const isOwnedFile = file.uploadUserId === getAuthUser()?.userId;

          const replacedItem = items!.find(i => i.name === 'replace');
          if (replacedItem) {
            replacedItem.visible = isOwnedFile || mode === FileListDataGridViewModes.page;
          }

          const deleteItem = items!.find(i => i.name === 'delete');
          if (deleteItem) {
            deleteItem.visible = isOwnedFile;
          }
        }}
        items={contextMenuItems} />
      <MainContextMenu ref={groupContextMenuRef} items={groupContextMenuItems} />
    </div>
  );
};