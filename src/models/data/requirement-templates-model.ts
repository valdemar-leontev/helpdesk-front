import { DescriptiveEntityModel } from '../abstracts/descriptive-entity-model';
import { QuestionModel } from './question-model';

export interface RequirementTemplateModel extends DescriptiveEntityModel {
    name: string;

    hasRequirementCategory: boolean;

    creationDate: Date;

    updateDate: Date;

    questions?: QuestionModel[];
}
