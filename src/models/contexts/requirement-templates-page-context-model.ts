import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { RequirementTemplateModel } from '../data/requirement-templates-model';
import { Proc } from '../abstracts/common-types';
import { RequirementTemplateListPageModes } from '../enums/requirement-template-list-page-modes';

export type RequirementTemplateListPageContextModel = {
    requirementTemplateList: RequirementTemplateModel[];

    setRequirementTemplateList: Dispatch<SetStateAction<RequirementTemplateModel[]>>;

    refreshRequirementTemplateList: Proc;

    requirementTemplateListPageMode: RequirementTemplateListPageModes;

    setRequirementTemplateListPageMode: Dispatch<SetStateAction<RequirementTemplateListPageModes>>;

    currentRequirementTemplateListItemRef: MutableRefObject<RequirementTemplateModel | null>;
}
