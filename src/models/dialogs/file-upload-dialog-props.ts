import { DialogProps } from './dialog-props';
import { FileAttachmentModes } from '../enums/file-attachment-modes';

export type UploadDialogCallback = (state: boolean) => Promise<void> | void;

export interface FileUploadDialogProps extends DialogProps {
    mode: FileAttachmentModes;

    requirementId?: number;

    callback?: UploadDialogCallback;

    fileUid?: string;

    fileUploadedCallback?: () => Promise<void> | void;

    fileListUploadedCallback?: () => Promise<void> | void;
}