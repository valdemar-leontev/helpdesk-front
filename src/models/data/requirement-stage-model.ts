import { EntityModel } from '../abstracts/entity-model';

export interface RequirementStageModel extends EntityModel {
    requirementId: number;

    profileId: number;

    userName: string;

    createdDate: Date;

    stateId: number;

    stateName: string;

    withComment: boolean;
}
