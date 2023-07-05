import { ReactNode } from 'react';

export type SimpleDialogContentModel = {
    iconName?: string,

    iconSize?: number,

    iconColor?: string,

    textRender: () => ReactNode
}

export type SimpleDialogModel = SimpleDialogContentModel & {
    title: string,

    callback?: ((dialogResult?: boolean) => void) | ((dialogResult?: boolean) => Promise<void>)
}
