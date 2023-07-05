import { DescriptiveEntityModel } from '../abstracts/descriptive-entity-model';

export interface RequirementCategoryModel extends DescriptiveEntityModel {
    hasAgreement: boolean;

    requirementCategoryTypeDescription: string;

    requirementCategoryTypeId: number;
}
