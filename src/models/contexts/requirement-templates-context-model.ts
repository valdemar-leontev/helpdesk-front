import { RequirementTemplateModel } from '../data/requirement-templates-model';
import { Dispatch, SetStateAction } from 'react';

export type RequirementTemplateContextModel = {
    currentRequirementTemplate: RequirementTemplateModel | null;

    setCurrentRequirementTemplate: Dispatch<SetStateAction<RequirementTemplateModel | null>>;

    isRequirementReview: boolean;
}
