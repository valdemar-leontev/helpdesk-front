import { useCallback, useMemo } from 'react';
import {
  DeleteIcon,
  OpenInNewTab,
  RenameIcon,
  RequirementIcon
} from '../../../../components/icons/icons';
import { appConstants } from '../../../../constants/app-constants';
import { useAppAuthContext } from '../../../../contexts/app-auth-context';
import notify from 'devextreme/ui/notify';
import { PromptDialogProps } from '../../../../models/dialogs/prompt-dialog-props';
import { showAlertDialog, showConfirmDialog } from '../../../../utils/common-dialogs';
import { useCommonDialogsContext } from '../../../../contexts/common-dialog-context';
import { useAppDataContext } from '../../../../contexts/app-data-context';
import { useRequirementTemplateListPageContext } from '../../requirement-template-list-page-context';
import { useNavigate } from 'react-router';

export const useRequirementTemplateTileItemContextMenuItems = () => {
  const { showDialog } = useCommonDialogsContext();
  const { deleteRequirementTemplateAsync, renameRequirementTemplateAsync, getProfileExistAsync } = useAppDataContext();
  const { setRequirementTemplateList, refreshRequirementTemplateList, currentRequirementTemplateListItemRef } = useRequirementTemplateListPageContext();
  const { isAdmin } = useAppAuthContext();
  const navigate = useNavigate();

  const onRenameRequirementTemplateAsync = useCallback(async () => {
    showDialog('PromptDialog', {
      visible: true,
      initialValue: currentRequirementTemplateListItemRef!.current!.name,
      callback: async (value: string) => {
        if (value && currentRequirementTemplateListItemRef!.current!.id) {
          const changedRequirementTemplate = await renameRequirementTemplateAsync(currentRequirementTemplateListItemRef!.current!.id, value);
          if (changedRequirementTemplate) {
            refreshRequirementTemplateList();
          }
        }
      }
    } as PromptDialogProps);
  }, [refreshRequirementTemplateList, renameRequirementTemplateAsync, showDialog, currentRequirementTemplateListItemRef]);

  const onDeleteRequirementTemplate = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.deleting,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'DeleteIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите удалить форму?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const deletedRequirementTemplate = await deleteRequirementTemplateAsync(currentRequirementTemplateListItemRef!.current!.id);
        if (deletedRequirementTemplate) {
          setRequirementTemplateList(prevState => prevState.filter(q => q.id !== currentRequirementTemplateListItemRef!.current!.id));
          notify(appConstants.strings.requirementDeleted, 'success', 3000);
        }
      }
    });
  }, [currentRequirementTemplateListItemRef, deleteRequirementTemplateAsync, setRequirementTemplateList]);

  const openInNewTabAsync = useCallback(() => {
    window.open(`/requirement-template/${currentRequirementTemplateListItemRef!.current!.id}`, '_blank');
  }, [currentRequirementTemplateListItemRef]);

  const onPassageRequirementTemplateAsync = useCallback(async () => {
    const profileIsExisted = await getProfileExistAsync();
    if (profileIsExisted) {
      window.open(`/requirement/${currentRequirementTemplateListItemRef!.current!.id}`, '_blank');
    } else {
      showAlertDialog({
        title: appConstants.strings.alert,
        iconColor: appConstants.appearance.baseDarkGrey,
        iconName: 'ProfileIcon',
        iconSize: appConstants.appearance.hugeIconSize,
        textRender: () => {
          return (
            <>
              <span>Чтобы создать заявку вам необходимо заполнить данные профиля.</span>
            </>
          );
        },
        callback: () => {
          navigate('/profile');
        }
      });
    }

  }, [currentRequirementTemplateListItemRef, getProfileExistAsync, navigate]);

  return useMemo(() => {

    return [
      {
        icon: () => <OpenInNewTab size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: appConstants.strings.openOnNewTab,
        onClick: async () => {
          await openInNewTabAsync();
        },
        visible: isAdmin()
      },
      {
        icon: () => <RequirementIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Создать заявку',
        onClick: async () => {
          await onPassageRequirementTemplateAsync();
        }
      },
      {
        icon: () => <RenameIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Переименовать...',
        onClick: async () => {
          await onRenameRequirementTemplateAsync();
          refreshRequirementTemplateList();
        },
        visible: isAdmin()
      },
      {
        icon: () => <DeleteIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />,
        text: 'Удалить...',
        onClick: async () => {
          await onDeleteRequirementTemplate();
          refreshRequirementTemplateList();
        },
        visible: isAdmin()
      }
    ];
  }, [isAdmin, openInNewTabAsync, onPassageRequirementTemplateAsync, onRenameRequirementTemplateAsync, refreshRequirementTemplateList, onDeleteRequirementTemplate]);
};
