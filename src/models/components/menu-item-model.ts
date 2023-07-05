import { ReactNode } from 'react';
import { ItemClickEvent } from 'devextreme/ui/menu';

export type MenuItemModel = {
    name?: string;

    text?: string;

    items?: MenuItemModel[];

    icon?: (item: MenuItemModel) => ReactNode;

    onClick?: (e: ItemClickEvent) => Promise<void> | void,

    visible?: boolean;

    beginGroup?: boolean;

    isSelectable?: boolean;
}
