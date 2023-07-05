import { DialogProps } from './dialog-props';
import { RequirementModel } from '../data/requirement-model';
import { FileModel } from '../data/file-model';

export interface FileDialogProps extends DialogProps {
    currentRequirement: RequirementModel;

    fileList: FileModel[];

    fileDeletedCallback?: () => Promise<void> | void;
}