import { DialogProps } from './dialog-props';

export type NotificationDialogCallback = () => Promise<void> | void;

export interface NotificationListDialogProps extends DialogProps {
    targetItem?: HTMLElement;

    callback: NotificationDialogCallback;
}