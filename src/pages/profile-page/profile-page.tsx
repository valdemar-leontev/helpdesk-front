import './profile-page.scss';
import { Navbar } from '../../components/navbar/navbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { useEffect, useRef, useState } from 'react';
import { appConstants } from '../../constants/app-constants';
import { useAppDataContext } from '../../contexts/app-data-context';
import { ProfileModel } from '../../models/data/profile-model';
import { DescriptiveEntityModel } from '../../models/abstracts/descriptive-entity-model';
import { PasswordIcon } from '../../components/icons/icons';
import ContextMenu from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { MainContextMenu } from '../../components/menu/main-context-menu/main-context-menu';
import { DialogProps } from '../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { EditProfileDialogContent } from '../../components/dialogs/edit-profile-dialog/edit-profile-dialog-content';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';

export const ProfilePage = () => {
  const { getProfileAsync, getDictionaryAsync } = useAppDataContext();
  const [currentProfile, setCurrentProfile] = useState<ProfileModel>();
  const [positionItems, setPositionItems] = useState<DescriptiveEntityModel[]>();
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line prefer-const
      let [positionItems, userProfile] = await Promise.all(
        [
          getDictionaryAsync('Position'),
          getProfileAsync()
        ]
      );
      if (positionItems) {
        setPositionItems(positionItems);
      }

      if (!userProfile) {
        userProfile = {
          id: 0,
          userId: getAuthUser()?.userId,
        } as ProfileModel;
      }

      setCurrentProfile(userProfile);
    })();
  }, [getProfileAsync, getDictionaryAsync, getAuthUser]);

  return (
    currentProfile && positionItems
      ? <div>
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
        <div className={'user-profile-card'}>
          <div className={'user-profile-main-info card'}>
            <div className={'user-profile-card-avatar'}>
              <span>HELPDESK</span>
            </div>
            <span className={'user-profile-card-name'}>{currentProfile?.firstName} {currentProfile?.lastName}</span>
            <span className={'user-profile-card-appointment'}>{positionItems?.find(p => p.id === currentProfile?.positionId)?.description}</span>
          </div>

          <div className={'user-profile-additional-info card'}>
            <EditProfileDialogContent {...{ userId: currentProfile.userId, editMode: false, visible: true }} />
          </div>
        </div>

        <MainContextMenu ref={rowContextMenuRef} items={[
          {
            text: 'Редактировать пароль',
            icon: () => <PasswordIcon size={appConstants.appearance.normalIconSize} />,
            onClick: () => showDialog('ChangePasswordDialog', { visible: true } as DialogProps)
          },
        ]} />
      </div>
      : <div className={'dx-empty-message'}>{appConstants.strings.noData}</div>
  );
};
