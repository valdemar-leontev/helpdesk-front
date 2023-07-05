import { DialogProps } from './dialog-props';
import { PromptDialogCallback } from './prompt-dialog-props';
import { RequirementStates } from '../enums/requirement-states';

export interface RequirementCommentDialogProps extends DialogProps {
    value: string;
    
    buttonText: string;

    requirementId: number;

    newRequirementState: RequirementStates;

    callback: PromptDialogCallback;
}
