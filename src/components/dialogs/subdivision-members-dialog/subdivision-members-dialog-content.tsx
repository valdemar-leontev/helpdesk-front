import './subdivision-members-dialog.scss';
import { SubdivisionMembersDialogProps } from '../../../models/dialogs/subdivision-members-dialog-props';
import { DataGrid, Paging, Selection, Column, SearchPanel, Pager, Item, Toolbar } from 'devextreme-react/ui/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { appConstants } from '../../../constants/app-constants';
import { useCallback, useRef, useState } from 'react';
import { ProfileListItemModel } from '../../../models/data/profile-list-item-model';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { PersonGroupIcon, UngroupIcon } from '../../icons/icons';

export const SubdivisionMembersDialogContent = ({ currentProfileListItems, originalSelectedProfileKeys, callback, buttonText }: SubdivisionMembersDialogProps) => {
  const dataGridRef = useRef<DataGrid<ProfileListItemModel>>(null);
  const [currentSelectedProfileKeys, setCurrentSelectedProfileKeys] = useState<number[]>(originalSelectedProfileKeys);
  const [isGrouping, setIsGrouping] = useState<boolean>(false);
  const { showDialog } = useCommonDialogsContext();

  const onGroupBySubdivision = useCallback(() => {
    const dataGridInstance = dataGridRef.current!.instance;

    dataGridInstance.columnOption('subdivisionName', 'groupIndex', 0);
    dataGridInstance.collapseAll(0);

    setIsGrouping(prevState => !prevState);
  }, []);

  const onSaveSubdivisionMembersAsync = useCallback(async () => {
    if (callback) {
      showDialog('SubdivisionMembersDialog', { visible: false } as SubdivisionMembersDialogProps);
      let updatedProfileList = await dataGridRef.current?.instance.getSelectedRowsData();

      if (!updatedProfileList) {
        updatedProfileList = [];
      }

      callback(updatedProfileList);
    }
  }, [callback, showDialog]);

  return (
    <div className={'subdivision-members'}>
      <DataGrid
        ref={dataGridRef}
        className={'app-data-grid'}
        dataSource={currentProfileListItems}
        focusedRowEnabled={true}
        keyExpr={'id'}
        width={'100%'}
        height={500}
        showColumnHeaders={false}
        onContentReady={async (e) => {
          await e.component.selectRows(currentSelectedProfileKeys, true);
        }}
        onSelectedRowKeysChange={(e) => {
          setCurrentSelectedProfileKeys(e);
        }}
      >
        <Toolbar>
          <Item>
            <Button
              className={'app-command-button'}
              hint={'Группировать по подразделениям'}
              visible={!isGrouping}
              onClick={() => {
                onGroupBySubdivision();
              }}>
              <PersonGroupIcon size={appConstants.appearance.normalIconSize} />
            </Button>
          </Item>

          <Item>
            <Button
              className={'app-command-button'}
              hint={'Разгруппировать по подразделениям'}
              visible={isGrouping}
              onClick={async () => {
                const dataGridInstance = dataGridRef.current!.instance;

                dataGridInstance.columnOption('subdivisionName', 'groupIndex', -1);
                setIsGrouping(prevState => !prevState);
              }}>
              <UngroupIcon size={appConstants.appearance.normalIconSize} />
            </Button>
          </Item>
          <Item
            name={'searchPanel'}
            location="after" />
        </Toolbar>

        <SearchPanel width={300} visible={true} highlightCaseSensitive={true} />
        <Selection
          mode={'multiple'}
          selectAllMode={'allPages'}
          showCheckBoxesMode={'always'}
        />
        <Column
          dataField={'id'}
          dataType={'number'}
          visible={false}
        />
        <Column
          dataField={'firstName'}
          dataType={'string'}
          calculateDisplayValue={(rowData) => {
            return rowData.firstName && rowData.lastName ? `${rowData.firstName} ${rowData.lastName}` : null;
          }}
        />
        <Column
          caption={'Подразделение'}
          dataField={'subdivisionName'}
          dataType={'string'}
          groupCellRender={(cellElement) => {
            return (
              <>
                {
                  cellElement.value === null
                    ? <span> {'[ Не установлено ]'} </span>
                    : <span>{cellElement.value}</span>
                }
              </>
            );
          }}
        />

        <Pager showNavigationButtons={true} allowedPageSizes={appConstants.pageSizes} showPageSizeSelector={false} />
        <Paging defaultPageSize={25} />
      </DataGrid>

      <div className='dialog-content__buttons'>
        <Button
          className='dialog-content__button'
          type={'default'}
          text={buttonText ? buttonText : appConstants.strings.save}
          onClick={async () => {
            await onSaveSubdivisionMembersAsync();
          }}
        />

        <Button
          className='dialog-content__button'
          type={'normal'}
          text={appConstants.strings.close}
          onClick={() => {
            showDialog('SubdivisionMembersDialog', { visible: false } as SubdivisionMembersDialogProps);
          }}
        />
      </div>
    </div>
  );
};
