import { MainContextMenu } from '../menu/main-context-menu/main-context-menu';
import { useMemo, useRef } from 'react';
import ContextMenu from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../models/components/menu-item-model';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';
import { useAppDataContext } from '../../contexts/app-data-context';
import {
  AddIcon,
  ArrowBackIcon,
  CategoryIcon, FolderIcon,
  RequirementIcon,
  RequirementStateAgreedIcon,
  RequirementTemplateIcon,
  TreeIcon
} from '../icons/icons';
import { appConstants } from '../../constants/app-constants';
import { DialogProps } from '../../models/dialogs/dialog-props';
import { useNavigate } from 'react-router';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import Button from 'devextreme-react/ui/button';

export const NavigationControl = () => {
  const ref = useRef<ContextMenu<MenuItemModel>>(null);
  const { showDialog } = useCommonDialogsContext();
  const { createRequirementTemplateAsync } = useAppDataContext();
  const navigate = useNavigate();
  const { isAdmin, isAuth } = useAppAuthContext();

  const mainContextMenuItems = useMemo(() => {
    return [
      {
        text: 'Назад',
        icon: () => <ArrowBackIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate(-1);
        },
      },
      {
        beginGroup: isAuth(),
        text: 'Организационное дерево',
        icon: () => <TreeIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/organization-tree');
        },
        visible: isAdmin()
      },
      {
        text: 'Категории заявок',
        icon: () => <CategoryIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/requirement-categories');
        },
        visible: isAdmin()
      },
      {
        visible: isAuth(),
        text: 'Заявки',
        icon: () => <RequirementIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        items: [
          {
            text: 'Журнал заявок',
            icon: () => <RequirementIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey}/>,
            closeMenuOnClick: true,
            onClick: () => {
              navigate('/requirements');
            },
            beginGroup: true
          },
          {
            text: 'Создать заявку',
            icon: () => <AddIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey}/>,
            closeMenuOnClick: true,
            onClick: () => {
              showDialog('RequirementTemplateListDialog', { visible: true } as DialogProps);
            },
          }
        ]
      },
      {
        text: 'Шаблоны заявок',
        icon: () => <RequirementTemplateIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        visible: isAdmin(),
        items: [
          {
            text: 'Журнал шаблонов',
            icon: () => <RequirementTemplateIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey}/>,
            closeMenuOnClick: true,
            onClick: () => {
              navigate('/requirement-templates');
            },
          },
          {
            text: 'Создать шаблон',
            icon: () => <AddIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey}/>,
            closeMenuOnClick: true,
            onClick: async () => {
              const requirementTemplate = await createRequirementTemplateAsync();
              if (requirementTemplate) {
                navigate(`/requirement-template/${requirementTemplate.id}`, {
                  state: requirementTemplate
                });
              }
            },
          }
        ]
      },
      {
        visible: isAuth(),
        text: 'Уведомления',
        icon: () => <RequirementStateAgreedIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/notifications');
        }
      },
      {
        text: 'Файлы',
        icon: () => <FolderIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/files');
        },
        visible: isAuth()
      },
    ] as MenuItemModel[];
  }, [createRequirementTemplateAsync, isAdmin, isAuth, navigate, showDialog]);

  return (
    <div className={'app-navigation-control'}>
      <MainContextMenu isTrulyContextMenu={true} target={'#contextMenu'} ref={ref} items={mainContextMenuItems} />
      <Button
        className={'app-command-button'}
        hint={'Назад'}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon size={appConstants.appearance.normalIconSize} />
      </Button>
    </div>
  );
};