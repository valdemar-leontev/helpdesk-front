import { Template } from 'devextreme-react/core/template';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import Toolbar, { Item } from 'devextreme-react/ui/toolbar';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { appConstants } from '../../../constants/app-constants';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { showConfirmDialog } from '../../../utils/common-dialogs';
import { AdminIcon, LoginIcon, LogoutIcon, ProfileIcon, UserIcon } from '../../icons/icons';
import { MainContextMenu } from '../../menu/main-context-menu/main-context-menu';

export const AuthToolbar = () => {
  const contextMenuRef = useRef<ContextMenu>(null);
  const navigate = useNavigate();
  const { isAuth, signOut, refreshStateTag, isAdmin } = useAppAuthContext();

  // TODO: duplicate fragment
  const authMenuItems = useMemo(() => {
    return [
      {
        text: appConstants.strings.profile,
        icon: () => <ProfileIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/profile');
        },
        visible: isAuth(),
      },
      {
        text: appConstants.strings.signIn,
        icon: () => <LoginIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/login');
        },
        visible: !isAuth(),
      },
      {
        text: appConstants.strings.signOut,
        icon: () => <LogoutIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          showConfirmDialog({
            title: appConstants.strings.confirm,
            iconColor: appConstants.appearance.baseDarkGrey,
            iconName: 'QuestionIcon',
            iconSize: appConstants.appearance.hugeIconSize,
            textRender: () => {
              return (
                <span>Действительно хотите выйти из системы?</span>
              );
            },
            callback: async (dialogResult?: boolean) => {
              if (!dialogResult) {
                return;
              }
              signOut();
              navigate('/', { state: { redirectFromSignOut: true } });
            }
          });
        },
        visible: isAuth(),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, isAuth, signOut, refreshStateTag]);

  return (
    <>
      <Toolbar>
        <Item
          location={'after'}
          widget={'dxButton'}
          cssClass={'app-rounded-button'}
          options={{
            template: 'loginTemplate',
            elementAttr: {
              className: 'app-rounded-button',
            },
            onClick: async (e) => {
              if (contextMenuRef.current) {
                const contextMenu = contextMenuRef.current.instance;
                contextMenu.option('target', e.element);
                await contextMenu.show();
              }
            },
          }}
        />

        <Template
          name='loginTemplate'
          render={() => {
            return isAdmin() ? <AdminIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />
              : <UserIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />;
          }}
        />
      </Toolbar>

      <MainContextMenu ref={contextMenuRef} items={authMenuItems} />
    </>
  );
};
