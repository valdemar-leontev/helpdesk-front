import { forwardRef, Ref } from 'react';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../../models/components/menu-item-model';
import { MenuItem } from '../menu-item/menu-item';
import { Item, ShowingEvent } from 'devextreme/ui/context_menu';
import { appConstants } from '../../../constants/app-constants';

export type MainContextMenuProps = {
  innerRef?: Ref<ContextMenu<MenuItemModel>>;

  items: MenuItemModel[];

  target?: string | Element;

  isTrulyContextMenu?: boolean;

  onShowing?: ((e: ShowingEvent<MenuItemModel>) => void) | undefined
}

export const MainContextMenuInner = ({ innerRef, items, target, isTrulyContextMenu, onShowing }: MainContextMenuProps) => {

  return <ContextMenu
    animation={appConstants.animationConfig}
    ref={innerRef}
    hideOnOutsideClick={true}
    itemRender={(item) => <MenuItem item={item} />}
    showEvent={isTrulyContextMenu ? 'dxcontextmenu' : 'suppress'}
    items={items as unknown as Item[]}
    position={isTrulyContextMenu ? { } : { my: 'left top', at: 'left bottom' } }
    target={target}
    defaultVisible={false}
    showSubmenuMode={{ delay: 200 }}
    onShowing={onShowing}
    onItemClick={async e => {
      if ((e.itemData as MenuItemModel).isSelectable) {
        e.component.instance().selectItem(e.itemElement);
      }

      await e.component.instance().hide();
    }}
  />;
};

export const MainContextMenu = forwardRef<ContextMenu<any>, MainContextMenuProps>((props, ref) =>
  <MainContextMenuInner {...props} innerRef={ref} />
);
