import { EntityModel } from '../abstracts/entity-model';

export interface RequirementCommentModel extends EntityModel {
    description: string;

    senderProfileId: number;

    requirementId: number;
}
