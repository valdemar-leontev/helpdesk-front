import { DialogProps } from './dialog-props';

export type PromptDialogCallback = (value: string) => Promise<void> | void;

export interface PromptDialogProps extends DialogProps {
    title?: string;

    initialValue?: string;

    callback: PromptDialogCallback;
}
