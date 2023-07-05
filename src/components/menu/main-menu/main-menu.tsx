import './main-menu.scss';
import { Menu } from 'devextreme-react/menu';
import { Item } from 'devextreme/ui/menu';
import { forwardRef, LegacyRef } from 'react';
import { MenuItemModel } from '../../../models/components/menu-item-model';
import { MenuItem } from '../menu-item/menu-item';

export type MainMenuProps = {
  items: MenuItemModel[];
  innerRef?: LegacyRef<Menu<any>> | undefined
};

const MainMenuInner = ({ items, innerRef }: MainMenuProps) => {
  return (
    <Menu
      ref={innerRef}
      className={'main-menu'}
      hideSubmenuOnMouseLeave
      items={items as unknown as Item[]}
      itemRender={(item) => <MenuItem item={item} />}
    />
  );
};

export const MainMenu = forwardRef<Menu<any>, MainMenuProps>((props, ref) =>
  <MainMenuInner {...props} innerRef={ref} />
);


