import { DescriptiveEntityModel } from '../abstracts/descriptive-entity-model';
import { VariantModel } from './variant-model';

export interface QuestionModel extends DescriptiveEntityModel {
    isRequired: boolean;

    questionTypeId: number;

    requirementTemplateId: number;

    variants?: VariantModel[];

    clientUid: string;
}
