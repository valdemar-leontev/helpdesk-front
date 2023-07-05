import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RequirementButtonsModes } from '../../../models/enums/requirement-buttons-modes';
import { useUserAnswersContext } from '../user-answers-context';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { useNavigate } from 'react-router';
import { RequirementCategoryModel } from '../../../models/data/requirement-category-model';
import { RequirementModel } from '../../../models/data/requirement-model';
import { showConfirmDialog } from '../../../utils/common-dialogs';
import { appConstants } from '../../../constants/app-constants';
import notify from 'devextreme/ui/notify';
import { Button } from 'devextreme-react/ui/button';
import { RequirementStateDescriptions, RequirementStates } from '../../../models/enums/requirement-states';
import { useSearchParams } from 'react-router-dom';
import { RequirementCommentDialogProps } from '../../../models/dialogs/requirement-comment-dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { useRequirementTemplateContext } from '../../../contexts/requirement-template-context';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { FileUploadDialogProps } from '../../../models/dialogs/file-upload-dialog-props';
import { FileAttachmentModes } from '../../../models/enums/file-attachment-modes';
import { useAppSharedStateDispatcherContext } from '../../../contexts/app-shared-state-dispatcher-context';
import { SubdivisionMembersDialogProps } from '../../../models/dialogs/subdivision-members-dialog-props';
import { ProfileListItemModel } from '../../../models/data/profile-list-item-model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExtensionVertIcon, RequirementIcon, RequirementStateReassignedIcon } from '../../../components/icons/icons';
import { MainContextMenu } from '../../../components/menu/main-context-menu/main-context-menu';
import ContextMenu from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../../models/components/menu-item-model';

export const RequirementFooterButtonsFactory = () => {

  const { clearUserAnswers, collectUserAnswers, formRefs, requirementNameFormRef, requirementCategoryFormRef } = useUserAnswersContext();
  const { isRequirementReview } = useRequirementTemplateContext();
  const { createUserAnswersAgreementAsync, postRequirementStateAsync, getDictionaryAsync, createUserAnswersAsync, getRequirementOutgoingNumberAsync, getDictionaryItemAsync, getProfileListAsync, putReassignRequirementAsync } = useAppDataContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [buttonsMode, setButtonsMode] = useState<RequirementButtonsModes>();
  const { currentRequirement } = useUserAnswersContext();
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();
  const [requirementCategoryList, setRequirementCategoryList] = useState<RequirementCategoryModel[] | null>([]);
  const { updateNotificationCount } = useAppSharedStateDispatcherContext();
  const contextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);

  const onReassignAsync = useCallback(async () => {
    const profileList = await getProfileListAsync(null);

    showDialog('SubdivisionMembersDialog', {
      visible: true,
      buttonText: 'Далее',
      currentProfileListItems: profileList,
      originalSelectedProfileKeys: [],
      callback: async (updatedProfileListItems: ProfileListItemModel[]) => {
        showConfirmDialog({
          title: appConstants.strings.confirm,
          iconColor: appConstants.appearance.baseDarkGrey,
          iconName: 'CommentIcon',
          iconSize: appConstants.appearance.hugeIconSize,
          textRender: () => (<span>Оставить комментарий?</span>),
          callback: async (dialogResult?: boolean) => {

            if (dialogResult) {
              if (currentRequirement) {
                await putReassignRequirementAsync(updatedProfileListItems, currentRequirement.id);
              }

              showDialog('RequirementCommentDialog', {
                visible: true,
                buttonText: 'Переназначить',
                requirementId: currentRequirement.id,
                newRequirementState: RequirementStates.reassigned
              } as RequirementCommentDialogProps);

            } else {
              if (currentRequirement) {
                const newRequirementLinkProfileList = await putReassignRequirementAsync(updatedProfileListItems, currentRequirement.id);
                const requirement = await postRequirementStateAsync(currentRequirement.id, RequirementStates.reassigned, null);

                if (newRequirementLinkProfileList && requirement) {
                  notify('Заявка была успешно переназначена.', 'success', 3000);
                  navigate('/requirements');
                }
              }
            }
          }
        });
      }
    } as SubdivisionMembersDialogProps);
  }, [currentRequirement, getProfileListAsync, navigate, postRequirementStateAsync, putReassignRequirementAsync, showDialog]);

  const contextMenuItems = useMemo(() => {
    return [
      {
        text:  'Переназначить',
        icon: () => <RequirementStateReassignedIcon size={appConstants.appearance.normalIconSize} />,
        onClick: async () => {
          await onReassignAsync();
        }
      }
    ] as MenuItemModel[];
  }, [onReassignAsync]);

  useEffect(() => {
    (async () => {
      if (!currentRequirement) {

        return;
      }

      if (!isRequirementReview) {
        setButtonsMode(RequirementButtonsModes.passing);

        return;
      }

      switch (currentRequirement.requirementStateId) {
      case RequirementStates.inExecution: {
        setButtonsMode(RequirementButtonsModes.requirementInExecution);

        break;
      }
      case RequirementStates.completed: {
        setButtonsMode(RequirementButtonsModes.requirementCompleted);

        break;
      }
      case RequirementStates.created:
      case RequirementStates.reassigned: {
        setButtonsMode(currentRequirement.hasAgreement
          ? RequirementButtonsModes.reviewWithAgreement
          : RequirementButtonsModes.reviewWithoutAgreement
        );

        break;
      }}
    })();
  }, [currentRequirement, isRequirementReview, searchParams]);

  useEffect(() => {
    (async () => {
      const currentRequirementCategoryList = await getDictionaryAsync('RequirementCategory');

      if (currentRequirementCategoryList) {
        setRequirementCategoryList(currentRequirementCategoryList as RequirementCategoryModel[]);
      }
    })();
  }, [getDictionaryAsync]);

  const onCreateUserAnswersAsync = useCallback(async (requirement: RequirementModel) => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'QuestionIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите создать заявку?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {

          return;
        }

        const currentRequirementCategory = requirementCategoryList!.find(c => c.id === requirement.requirementCategoryId);

        const createdRequirement = currentRequirementCategory && currentRequirementCategory.hasAgreement
          ? await createUserAnswersAgreementAsync(requirement)
          : await createUserAnswersAsync(requirement);

        if (!createdRequirement) {
          notify('Заявка не была создана.', 'error', 3000);

          return;
        }

        showConfirmDialog({
          title: appConstants.strings.confirm,
          iconColor: appConstants.appearance.baseDarkGrey,
          iconName: 'AttachmentIcon',
          iconSize: appConstants.appearance.hugeIconSize,
          textRender: () => {
            return (
              <span>Прикрепить файлы к заявке?</span>
            );
          },
          callback: async (dialogResult?: boolean) => {
            if (!dialogResult) {
              navigate('/requirements', { state: { requirementId: createdRequirement.id } });
            } else {
              showDialog('FileUploadDialog', {
                visible: true,
                mode: FileAttachmentModes.attachment,
                requirementId: createdRequirement.id
              } as FileUploadDialogProps);
            }
          }
        });

        notify(appConstants.strings.requirementSaved, 'success', 3000);
      }
    });
  }, [createUserAnswersAgreementAsync, createUserAnswersAsync, navigate, requirementCategoryList, showDialog]);

  const validateForms = useCallback(() => {
    let isValid = true;

    const formRefSet = (new Set([...formRefs, requirementNameFormRef, requirementCategoryFormRef]));

    for (const formRef of formRefSet.keys()) {
      if(!formRef || !formRef.current) {

        continue;
      }

      const validationGroupResult = formRef.current.instance.validate();

      if (!validationGroupResult || validationGroupResult.isValid) {

        continue;
      }

      isValid = false;
      const brokenRule = (validationGroupResult.brokenRules as any)?.findLast(() => true);
      if (brokenRule) {
        (brokenRule as any).validator.focus();
      }
    }

    return isValid;
  }, [formRefs, requirementCategoryFormRef, requirementNameFormRef]);

  const onAgreedHandlerAsync = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'RequirementIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => <span>Действительно хотите согласовать заявку?</span>,
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const requirement = collectUserAnswers();

        const updatedRequirement = await postRequirementStateAsync(requirement.id, RequirementStates.agreed, null);
        if (updatedRequirement) {
          notify('Заявка была согласована', 'success', 3000);
          navigate('/requirements');
        } else {
          notify('Произошла ошибка.', 'error', 3000);
        }
      }
    });
  }, [collectUserAnswers, navigate, postRequirementStateAsync]);

  const onCreateHandlerAsync = useCallback(async () => {
    const isValid = validateForms();
    if (!isValid) {
      notify(appConstants.strings.formIsNotFilled, 'warning', 3000);

      return;
    }

    const requirement = collectUserAnswers();
    if (!requirement || requirement.userAnswers.length === 0) {
      notify(appConstants.strings.formIsNotFilled, 'warning', 3000);

      return;
    }

    const requirementOutgoingNumber = await getRequirementOutgoingNumberAsync();
    if (!requirementOutgoingNumber) {
      notify('Не был получен исходящий номер заявки.', 'error', 3000);

      return;
    }

    requirement.outgoingNumber = requirementOutgoingNumber;

    if (requirement.requirementCategoryId) {
      const requirementCategory = await getDictionaryItemAsync('RequirementCategory', requirement.requirementCategoryId!);
      requirement.name = `${(requirementCategory as RequirementCategoryModel).description} №${requirementOutgoingNumber}`;
    } else {
      requirement.name = `Заявка №${requirementOutgoingNumber}`;
    }

    await onCreateUserAnswersAsync(requirement);
  }, [collectUserAnswers, getDictionaryItemAsync, getRequirementOutgoingNumberAsync, onCreateUserAnswersAsync, validateForms]);

  const onAcceptWithoutAgreementHandlerAsync = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'CommentIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => (<span>Оставить комментарий?</span>),
      callback: async (dialogResult?: boolean) => {
        if (!currentRequirement) {

          return;
        }

        if (dialogResult) {
          showDialog('RequirementCommentDialog', { visible: true, buttonText: 'Принять', requirementId: currentRequirement.id, newRequirementState: RequirementStates.inExecution } as RequirementCommentDialogProps);
        } else {
          const requirement = await postRequirementStateAsync(currentRequirement.id, RequirementStates.inExecution, null);

          if (requirement) {
            notify('Заявка была принята без комментария.', 'success', 3000);
            navigate('/requirements');
          }
        }

        await updateNotificationCount();
      }
    });
  }, [currentRequirement, navigate, postRequirementStateAsync, showDialog, updateNotificationCount]);

  const onRejectWithoutAgreementHandlerAsync = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'CommentIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => (<span>Оставить комментарий?</span>),
      callback: async (dialogResult?: boolean) => {
        if (!currentRequirement) {

          return;
        }

        if (dialogResult) {
          showDialog('RequirementCommentDialog', { visible: true, buttonText: 'Отклонить', requirementId: currentRequirement.id, newRequirementState: RequirementStates.rejected } as RequirementCommentDialogProps);
        } else {
          const requirement = await postRequirementStateAsync(currentRequirement.id, RequirementStates.rejected, null);

          if (requirement) {
            notify('Заявка была принята без комментария.', 'success', 3000);
            navigate('/requirements');
          }
        }

        await updateNotificationCount();
      }
    });
  }, [currentRequirement, navigate, postRequirementStateAsync, showDialog, updateNotificationCount]);

  const onRejectWithAgreementHandlerAsync = useCallback(async () => {
    showConfirmDialog({
      title: 'Отклонить',
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'RequirementIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => (<span>Действительно хотите отклонить заявку?</span>),
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const requirement = collectUserAnswers();

        const updatedRequirement = await postRequirementStateAsync(requirement.id, RequirementStates.rejected, null);
        if (updatedRequirement) {
          notify('Заявка была отклонена', 'success', 3000);
          navigate('/requirements');
        } else {
          notify('Произошла ошибка.', 'error', 3000);
        }
      }
    });
  }, [collectUserAnswers, navigate, postRequirementStateAsync]);

  const onCompleteOrCloseRequirementAsync = useCallback((state: RequirementStates) => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'QuestionIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        debugger;
        return (
          <span>Перевести заявку в состояние <b>{RequirementStateDescriptions[RequirementStates[state]]}</b>?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        if (currentRequirement) {
          const updatedRequirement = await postRequirementStateAsync(currentRequirement.id, state, null);

          if (updatedRequirement) {
            notify(`Заявка успешно переведена в состояние ${RequirementStateDescriptions[RequirementStates[state]]}`, 'success', 3000);
            navigate('/requirements');
          }
        }
      }
    });
  }, [currentRequirement, navigate, postRequirementStateAsync]);

  const buttonsFactory = useCallback((buttonsMode?: RequirementButtonsModes) => {
    switch (buttonsMode) {
    case RequirementButtonsModes.passing:
      return (
        <>
          <Button
            text={appConstants.strings.create}
            stylingMode={'contained'}
            type={'default'}
            onClick={async () => await onCreateHandlerAsync()}
          />
          <Button
            onClick={() => {
              clearUserAnswers();
              notify(appConstants.strings.requirementCleaned, 'success', 3000);
            }}
            text={appConstants.strings.clear}
            stylingMode={'contained'}
            type={'normal'}/>
        </>
      );

    case RequirementButtonsModes.reviewWithoutAgreement:
      return (
        currentRequirement && currentRequirement.profileId !== getAuthUser()?.profileId
          ? <>
            <Button
              text={'Принять'}
              stylingMode={'contained'}
              type={'default'}
              onClick={async () => await onAcceptWithoutAgreementHandlerAsync()}
            />
            <Button
              text={'Отклонить'}
              stylingMode={'contained'}
              type={'normal'}
              onClick={async () => await onRejectWithoutAgreementHandlerAsync()}
            />

            <Button className={'app-rounded-button'} onClick={async e => {
              if (contextMenuRef && contextMenuRef.current) {
                contextMenuRef.current.instance.option('target', e.element);
                await contextMenuRef.current.instance.show();
              }
            }} >
              <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
            </Button>
            <MainContextMenu
              ref={contextMenuRef}
              items={contextMenuItems}
            />
          </>
          : null
      );

    case RequirementButtonsModes.reviewWithAgreement:
      return (
        <>
          <Button
            onClick={async () => await onAgreedHandlerAsync()}
            text={'Согласовать'}
            stylingMode={'contained'}
            type={'default'}/>

          <Button
            onClick={async () => await onRejectWithAgreementHandlerAsync()}
            text={'Отклонить'}
            stylingMode={'contained'}
            type={'normal'}/>
        </>
      );

    case RequirementButtonsModes.requirementInExecution:
      return (
        currentRequirement && currentRequirement.profileId !== getAuthUser()?.profileId
          ?
          <Button
            text={'Выполнить'}
            stylingMode={'contained'}
            type={'default'}
            onClick={() => onCompleteOrCloseRequirementAsync(RequirementStates.completed)}
          />
          : null
      );

    case RequirementButtonsModes.requirementCompleted:
      return (
        currentRequirement && currentRequirement.profileId === getAuthUser()?.profileId
          ?
          <Button
            text={'Закрыть'}
            stylingMode={'contained'}
            type={'default'}
            onClick={() => onCompleteOrCloseRequirementAsync(RequirementStates.closed)}
          />
          : null
      );

    default:
      return null;
    }
  }, [clearUserAnswers, currentRequirement, contextMenuItems, getAuthUser, onAcceptWithoutAgreementHandlerAsync, onAgreedHandlerAsync, onCompleteOrCloseRequirementAsync, onCreateHandlerAsync, onRejectWithAgreementHandlerAsync, onRejectWithoutAgreementHandlerAsync]);

  return (
    <>
      {buttonsFactory(buttonsMode)}
    </>
  );
};
