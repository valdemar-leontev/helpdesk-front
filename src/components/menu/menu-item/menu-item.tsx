import { MenuItemProps } from '../../../models/components/menu-item-props';
import './menu-item.scss';
import { ArrowRightIcon } from '../../icons/icons';
import { appConstants } from '../../../constants/app-constants';

export const MenuItem = ({ item }: MenuItemProps) => {
  return (
    <div className={'menu-item'}>
      {item.icon ? item.icon(item) : null}
      {item.text ? <span className={'dx-menu-item-text'}>{item.text}</span> : null}
      { item.items ? <ArrowRightIcon size={appConstants.appearance.normalIconSize} /> : null }
    </div>
  );
};
