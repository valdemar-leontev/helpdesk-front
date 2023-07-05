import { Item, Toolbar } from 'devextreme-react/ui/toolbar';
import { showConfirmDialog } from '../../../utils/common-dialogs';
import { Template } from 'devextreme-react/core/template';
import { ExtensionVertIcon, EyeIcon, GridIcon, LinkIcon, LoginIcon, LogoutIcon, ProfileIcon, UserIcon } from '../../../components/icons/icons';
import { useRequirementTemplateHelper } from '../../../utils/requirement-template-helper';
import { useRequirementTemplateContext } from '../../../contexts/requirement-template-context';
import { useNavigate } from 'react-router';
import { appConstants } from '../../../constants/app-constants';
import { MainContextMenu } from '../../../components/menu/main-context-menu/main-context-menu';
import { useMemo, useRef } from 'react';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { useCommonNavbarMenuItems } from '../../../utils/use-common-navbar-menu-items';
import { useMediaQuery } from 'react-responsive';
import { MenuItemModel } from '../../../models/components/menu-item-model';
import { useAppAuthContext } from '../../../contexts/app-auth-context';

export const RequirementTemplateToolbar = () => {
  const { createRequirement, showPreview } = useRequirementTemplateHelper();
  const { currentRequirementTemplate } = useRequirementTemplateContext();
  const navigate = useNavigate();
  const contextMenuRef = useRef<ContextMenu>(null);
  const contextMenuAuthRef = useRef<ContextMenu>(null);
  const commonNavbarMenuItems = useCommonNavbarMenuItems();
  const { isAuth, signOut, refreshStateTag } = useAppAuthContext();

  const isMobileScreen = useMediaQuery({
    query: '(max-width: 425px)'
  });

  const menuItems = useMemo(() => {
    return [
      {
        text: appConstants.strings.create,
        icon: () => <LinkIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: async () => {
          await createRequirement(currentRequirementTemplate!);
        },
      },
      {
        text: appConstants.strings.preview,
        icon: () => <EyeIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          showPreview(currentRequirementTemplate!);
        },
      },
      {
        text: appConstants.strings.formsList,
        icon: () => <GridIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/requirement-templates');
        },
      }] as MenuItemModel[];
  }, [currentRequirementTemplate, navigate, createRequirement, showPreview]);

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
          visible={!isMobileScreen}
          options={
            {
              elementAttr: {
                className: 'app-rounded-button'
              },
              // type: 'default',
              hint: appConstants.strings.preview,
              onClick: () => {
                showPreview(currentRequirementTemplate!);
              },
              template: 'previewButtonTemplate',
            }
          } />

        <Item
          location={'after'}
          widget={'dxButton'}
          cssClass={'app-rounded-button'}
          visible={!isMobileScreen}
          options={
            {
              elementAttr: {
                className: 'app-rounded-button'
              },
              // type: 'default',
              hint: appConstants.strings.formsList,
              onClick: () => {
                showConfirmDialog({
                  title: appConstants.strings.confirm,
                  iconColor: appConstants.appearance.baseDarkGrey,
                  iconName: 'QuestionIcon',
                  iconSize: appConstants.appearance.hugeIconSize,
                  textRender: () => {
                    return (
                      <span>Действительно хотите покинуть конструктор формы?</span>
                    );
                  },
                  callback: async (dialogResult?: boolean) => {
                    if (!dialogResult) {
                      return;
                    }

                    navigate('/requirement-templates');
                  }
                });
              },
              template: 'backToRequirementTemplatesTemplate',
            }
          } />

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
              if (contextMenuAuthRef.current) {
                const contextMenu = contextMenuAuthRef.current.instance;
                contextMenu.option('target', e.element);
                await contextMenu.show();
              }
            },
          }}
        />

        <Item location={'after'}
          widget={'dxButton'}
          visible={!isMobileScreen}
          options={
            {
              text: appConstants.strings.create,
              stylingMode: 'contained',
              type: 'default',
              hint: appConstants.strings.create,
              onClick: async () => {
                await createRequirement(currentRequirementTemplate!);
              }
            }
          } />


        <Item
          location={'after'}
          widget={'dxButton'}
          cssClass={'app-rounded-button'}
          options={
            {
              template: 'extensionMenuTemplate',
              elementAttr: {
                className: 'app-rounded-button'
              },
              onClick: async (e) => {
                if (contextMenuRef.current) {
                  const contextMenu = contextMenuRef.current.instance;
                  contextMenu.option('target', e.element);
                  await contextMenu.show();
                }
              }
            }
          } />

        <Template
          name='loginTemplate'
          render={() => {
            return <UserIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />;
          }}
        />

        <Template name='extensionMenuTemplate' render={() => {
          return (
            <ExtensionVertIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />
          );
        }} />

        <Template name='previewButtonTemplate' render={() => {
          return (
            <EyeIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />
          );
        }} />

        <Template name='backToRequirementTemplatesTemplate' render={() => {
          return (
            <GridIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />
          );
        }} />
      </Toolbar>

      <MainContextMenu ref={contextMenuRef} items={isMobileScreen ? [...menuItems, ...commonNavbarMenuItems] : commonNavbarMenuItems} />
      <MainContextMenu ref={contextMenuAuthRef} items={authMenuItems} />
    </>
  );
};
