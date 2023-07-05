import { RequirementTemplateModel } from '../data/requirement-templates-model';
import { ReactNode } from 'react';

export type RequirementTemplateTileItemProps = {
    children: ReactNode;

    requirementTemplate: RequirementTemplateModel;
}
