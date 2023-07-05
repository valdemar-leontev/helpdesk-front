import { DialogProps } from './dialog-props';

export interface EditProfileDialogProps extends DialogProps {
    userId: number;

    editMode: boolean;

    callback?: () => Promise<void> | void;
}
