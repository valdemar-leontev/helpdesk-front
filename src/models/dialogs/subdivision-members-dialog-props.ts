import { DialogProps } from './dialog-props';
import { ProfileListItemModel } from '../data/profile-list-item-model';

export interface SubdivisionMembersDialogProps extends DialogProps {
    buttonText?: string

    currentProfileListItems: ProfileListItemModel[];

    originalSelectedProfileKeys: number[];

    callback?: (updatedProfileListItems: ProfileListItemModel[]) => void | Promise<void>;
}
