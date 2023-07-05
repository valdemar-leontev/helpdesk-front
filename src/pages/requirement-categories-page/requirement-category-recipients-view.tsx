import { Column, DataGrid, Scrolling } from 'devextreme-react/ui/data-grid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProfileListItemModel } from '../../models/data/profile-list-item-model';
import { useAppDataContext } from '../../contexts/app-data-context';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { Button } from 'devextreme-react/ui/button';
import { DisconnectIcon, ExtensionVertIcon, ProfileIcon } from '../../components/icons/icons';
import { appConstants } from '../../constants/app-constants';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { showConfirmDialog } from '../../utils/common-dialogs';
import notify from 'devextreme/ui/notify';

export const RequirementCategoryRecipientsView = ({ requirementCategoryId, refreshStateTag }: { requirementCategoryId: number, refreshStateTag?: string }) => {

  const [profileList, setProfileList] = useState<ProfileListItemModel[] | null>([]);

  const { getRequirementCategoryProfileListAsync, deleteRequirementCategoryProfileAsync } = useAppDataContext();
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const dataGridRef = useRef<DataGrid<ProfileListItemModel>>(null);

  const getDataAsync = useCallback(async () => {
    const profiles = await getRequirementCategoryProfileListAsync(requirementCategoryId);

    if (profiles) {
      setProfileList(profiles);
    }
  }, [getRequirementCategoryProfileListAsync, requirementCategoryId]);

  useEffect(() => {
    (async () => {
      await getDataAsync();
    })();
  }, [getDataAsync, refreshStateTag]);

  const dataGridContextMenuItems = useMemo(() => {
    return [
      {
        icon: () => <DisconnectIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Отсоединить',
        onClick: () => {
          showConfirmDialog({
            title: appConstants.strings.confirm,
            iconColor: appConstants.appearance.baseDarkGrey,
            iconName: 'DisconnectIcon',
            iconSize: appConstants.appearance.hugeIconSize,
            textRender: () => {
              return (
                <span>Действительно хотите отсоединить пользователя?</span>
              );
            },
            callback: async (dialogResult?: boolean) => {
              if (!dialogResult) {
                return;
              }

              const profileId = dataGridRef.current?.instance.option('focusedRowKey');

              const deletedProfile = await deleteRequirementCategoryProfileAsync(profileId, requirementCategoryId);

              if (deletedProfile != null) {
                const updatedProfileList = profileList?.filter(p => p.id != profileId) ?? [];
                setProfileList(updatedProfileList);
                notify('Пользователь был отсоединен', 'success', 3000);
              }
            }
          });
        }
      },
    ];
  }, [deleteRequirementCategoryProfileAsync, profileList, requirementCategoryId]);

  return (
    <>
      <DataGrid
        ref={dataGridRef}
        className={'app-data-grid'}
        dataSource={profileList}
        focusedRowEnabled={true}
        keyExpr={'id'}
      >
        <Scrolling mode={'standard'} />

        <Column type={'buttons'} width={50} cellRender={() => {
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
          alignment={'center'}
          width={70}
          cellRender={() => {
            return (
              <ProfileIcon size={appConstants.appearance.normalIconSize} />
            );
          }}
        />

        <Column
          dataField='firstName'
          dataType='string'
          caption={'Имя'} />

        <Column
          dataField='lastName'
          dataType='string'
          caption={'Фамилия'} />

        <Column
          dataField='positionName'
          dataType='string'
          caption={'Должность'} />
      </DataGrid>

      <MainContextMenu ref={rowContextMenuRef} items={dataGridContextMenuItems} />
    </>
  );
};
