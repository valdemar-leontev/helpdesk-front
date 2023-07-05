import {
  AboutIcon,
  EditProfileIcon,
  EditRequirementCategoryIcon,
  FileIcon,
  FileUploadIcon,
  NotificationListIcon,
  PromptIcon,
  QuestionTypeMultipleSelectIcon,
  QuestionTypeSelectBoxIcon,
  QuestionTypeSingleSelectIcon,
  RequirementCommentIcon,
  RequirementStateAgreedIcon,
  RequirementStateClosedIcon,
  RequirementStateCompletedIcon,
  RequirementStateCreatedIcon,
  RequirementStateInExecutionIcon,
  RequirementStateReassignedIcon,
  RequirementStateRejectedIcon,
  RequirementStateUnderConsiderationIcon,
  RequirementTemplateListIcon,
  SubdivisionMembersIcon
} from './icons';
import { toCapitalize } from '../../utils/string-helpers';
import { RequirementStates } from '../../models/enums/requirement-states';
import React, { useCallback } from 'react';
import { QuestionTypes } from '../../models/enums/question-types';
import { appConstants } from '../../constants/app-constants';

export const useIconFactories = () => {
  const RequirementStateIconFactory = useCallback((requirementStateId: number) => {
    const icons = {
      RequirementStateCreatedIcon,
      RequirementStateUnderConsiderationIcon,
      RequirementStateAgreedIcon,
      RequirementStateInExecutionIcon,
      RequirementStateRejectedIcon,
      RequirementStateClosedIcon,
      RequirementStateCompletedIcon,
      RequirementStateReassignedIcon
    };

    const iconName = `RequirementState${toCapitalize(RequirementStates[requirementStateId])}Icon`;
    const Icon = icons[iconName];

    return <Icon size={20}/>;
  }, []);

  const QuestionTypeIconFactory = useCallback((questionTypeId: number) => {
    const icons = {
      QuestionTypeSingleSelectIcon,
      QuestionTypeMultipleSelectIcon,
      QuestionTypeSelectBoxIcon
    };

    const iconName = `QuestionType${toCapitalize(QuestionTypes[questionTypeId])}Icon`;
    const Icon = icons[iconName];

    return <Icon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />;
  }, []);

  const PopupTitleIconFactory = useCallback((dialogName: string) => {
    const icons = {
      AboutIcon,
      NotificationListIcon,
      PromptIcon,
      EditRequirementCategoryIcon,
      FileIcon,
      RequirementCommentIcon,
      RequirementTemplateListIcon,
      SubdivisionMembersIcon,
      FileUploadIcon,
      EditProfileIcon
    };

    const iconName = `${dialogName}Icon`;
    const Icon = icons[iconName];

    return <Icon size={appConstants.appearance.bigIconSize} />;
  }, []);

  return {
    RequirementStateIconFactory,
    QuestionTypeIconFactory,
    PopupTitleIconFactory
  };
};