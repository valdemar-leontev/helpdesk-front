import { EntityModel } from '../abstracts/entity-model';

export interface UserAnswerModel extends EntityModel {
    profileId: number;

    questionId: number;

    requirementId: number;

    variantId: number;

    value: string;
}
