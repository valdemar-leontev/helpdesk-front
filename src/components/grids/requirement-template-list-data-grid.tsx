import { Button } from 'devextreme-react/ui/button';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { DataGrid, SearchPanel, Column, Pager, Paging } from 'devextreme-react/ui/data-grid';
import { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { appConstants } from '../../constants/app-constants';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { DialogProps } from '../../models/dialogs/dialog-props';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { RequirementTemplateListDataGridModes } from '../../models/enums/requirement-template-list-data-grid-modes';
import { RequirementTemplateListDataGridProps } from '../../models/components/requirement-template-list-data-grid-props';
import { RequirementTemplateModel } from '../../models/data/requirement-templates-model';
import { useRequirementTemplateListPageContext } from '../../pages/requirement-template-list-page/requirement-template-list-page-context';
import { useRequirementTemplateTileItemContextMenuItems } from '../../pages/requirement-template-list-page/requirement-template-tile-view/requirement-template-tile-item/use-requirement-template-tile-item-context-menu-items';
import { AddIcon, ExtensionVertIcon, RequirementIcon } from '../icons/icons';
import { MainContextMenu } from '../menu/main-context-menu/main-context-menu';
import { ClickEvent } from 'devextreme/ui/button';

export const RequirementTemplateListDataGrid = ({ mode }: RequirementTemplateListDataGridProps) => {
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRef = useRef<DataGrid<RequirementTemplateModel>>(null);
  const { showDialog } = useCommonDialogsContext();
  const navigate = useNavigate();
  const contextMenuItems = useRequirementTemplateTileItemContextMenuItems();
  const { currentRequirementTemplateListItemRef, requirementTemplateList } = useRequirementTemplateListPageContext();

  const onCreateRequirement = useCallback(() => {
    const requirementTemplateId = dataGridRef.current?.instance.option('focusedRowKey');

    if (requirementTemplateId) {
      showDialog('RequirementTemplateListDialog', { visible: false } as DialogProps);
      navigate(`/requirement/${requirementTemplateId}`);
    }
  }, [navigate, showDialog]);

  const onShowGridRowContextMenuAsync = useCallback(async( e: ClickEvent) => {
    if (rowContextMenuRef && rowContextMenuRef.current) {
      const requirementTemplateId = dataGridRef.current?.instance.option('focusedRowKey');
      const requirementTemplate = requirementTemplateList?.find(r => r.id === requirementTemplateId);
      if (requirementTemplate) {
      currentRequirementTemplateListItemRef!.current = requirementTemplate;
      }
      rowContextMenuRef.current.instance.option('target', e.element);
      await rowContextMenuRef.current.instance.show();
    }
  }, [currentRequirementTemplateListItemRef, requirementTemplateList]);

  const dialogMenuItems = useMemo(() => {
    return [
      {
        text: appConstants.strings.createRequirement,
        icon: () => <RequirementIcon size={appConstants.appearance.normalIconSize} />,
        onClick: onCreateRequirement
      },
    ];
  }, [onCreateRequirement]);

  return (
    <>
      <DataGrid
        ref={dataGridRef}
        className={'user-requirements app-data-grid'}
        dataSource={requirementTemplateList}
        focusedRowEnabled={true}
        allowColumnReordering={true}
        columnHidingEnabled={true}
        keyExpr={'id'}
        width={'100%'}
      >
        <SearchPanel width={300} visible={true} highlightCaseSensitive={true} />

        <Column name={'contextMenuButton'} type={'buttons'} width={50} cellRender={() => {
          return (
            <Button className={'app-command-button'}
              onClick={onShowGridRowContextMenuAsync} >
              <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
            </Button>
          );
        }}
        />
        <Column
          dataField='name'
          dataType='string'
          caption={'Наименование'}
          width={200}
          hidingPriority={3}
        />
        <Column
          dataField='description'
          dataType='string'
          caption={'Описание'}
          width={400}
          hidingPriority={2}
        />
        <Column
          dataField='updateDate'
          dataType='datetime'
          caption={'Дата обновления'}
          hidingPriority={1}
          width={200}
        />
        <Column
          type={'buttons'}
          alignment={'center'}
          cellRender={() => {
            return (
              <Button type={'default'} className={'app-command-button-small'}
                hint={'Создать заявку'} onClick={onCreateRequirement}>
                <AddIcon size={appConstants.appearance.smallIconSize} />
              </Button>
            );
          }}
          width={100}
        />
        <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>

      <MainContextMenu ref={rowContextMenuRef} items={mode === RequirementTemplateListDataGridModes.page ? contextMenuItems : dialogMenuItems} />
    </>
  );
};

