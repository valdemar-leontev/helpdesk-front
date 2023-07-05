import { RequirementStates } from '../enums/requirement-states';
import { RequirementCommentModel } from './requirement-comment-model';

export type RequirementCommentStateModel = {
    state: RequirementStates;

    requirementComment: RequirementCommentModel | null;
}
