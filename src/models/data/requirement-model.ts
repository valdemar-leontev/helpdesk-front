import { EntityModel } from '../abstracts/entity-model';
import { UserAnswerModel } from './user-answer-model';

export interface RequirementModel extends EntityModel {
    profileId: number;

    userName: string | null;

    name: string | null;

    requirementTemplateId: number;

    requirementCategoryId: number | null;

    requirementCategoryTypeId: number | null;

    hasAgreement: boolean | null;

    creationDate: Date;

    requirementStateDescription: string;

    lastStageProfileName: string;

    withFiles: boolean;

    outgoingNumber: number;

    userAnswers: UserAnswerModel[];

    fileCount: number;

    isArchive: boolean;

    requirementStateId: number;
}
