import { Dispatch, SetStateAction } from 'react';

export type AppSharedContextModel = {
    previewModeUid: string | null;

    setPreviewModeUid: Dispatch<SetStateAction<string | null>>;

    isShowLoadPanel: boolean;

    setIsShowLoadPanel: Dispatch<SetStateAction<boolean>>;

    notificationCount: number,

    setNotificationCount: Dispatch<SetStateAction<number>>;
};
