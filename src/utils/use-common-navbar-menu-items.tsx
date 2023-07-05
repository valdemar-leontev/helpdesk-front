import { useMemo } from 'react';
import {
  RequirementTemplateIcon,
  RequirementIcon,
  RequirementStateAgreedIcon,
  TreeIcon,
  CategoryIcon,
  FolderIcon
} from '../components/icons/icons';
import { MenuItemModel } from '../models/components/menu-item-model';
import { useNavigate } from 'react-router';
import { useAppAuthContext } from '../contexts/app-auth-context';
import { appConstants } from '../constants/app-constants';
import { useCommonDialogsContext } from '../contexts/common-dialog-context';
import { FileUploadDialogProps } from '../models/dialogs/file-upload-dialog-props';
import { FileAttachmentModes } from '../models/enums/file-attachment-modes';
// import themes from 'devextreme/ui/themes';

export const useCommonNavbarMenuItems = () => {
  const navigate = useNavigate();
  const { isAuth, isAdmin, refreshStateTag } = useAppAuthContext();
  const { showDialog } = useCommonDialogsContext();

  return useMemo<MenuItemModel[]>(() => {
    return [
      {
        text: 'Загрузить',
        icon: () => <TreeIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          showDialog('FileUploadDialog', { visible: true, mode: FileAttachmentModes.simple } as FileUploadDialogProps);
        },
        // visible: isAuth() && isAdmin()
        visible: false
      },
      {
        text: 'Организационное дерево',
        icon: () => <TreeIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/organization-tree');
        },
        visible: isAuth() && isAdmin()
      },
      {
        text: 'Категории заявок',
        icon: () => <CategoryIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/requirement-categories');
        },
        visible: isAuth() && isAdmin()
      },
      {
        text: appConstants.strings.requirements,
        icon: () => <RequirementIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/requirements');
        },
        visible: isAuth()
      },
      {
        text: appConstants.strings.requirementTemplates,
        icon: () => <RequirementTemplateIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/requirement-templates');
        },
        visible: isAuth() && isAdmin(),
      },
      {
        text: 'Уведомления',
        icon: () => <RequirementStateAgreedIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/notifications');
        },
        visible: isAuth(),
      },
      {
        text: 'Файлы',
        icon: () => <FolderIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          navigate('/files');
        },
        visible: isAuth()
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, isAdmin, navigate, refreshStateTag]);
};
