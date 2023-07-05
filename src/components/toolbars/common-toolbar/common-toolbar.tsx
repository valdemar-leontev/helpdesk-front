import { Template } from 'devextreme-react/core/template';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import Toolbar, { Item } from 'devextreme-react/ui/toolbar';
import { useRef } from 'react';
import { appConstants } from '../../../constants/app-constants';
import { useCommonNavbarMenuItems } from '../../../utils/use-common-navbar-menu-items';
import { ExtensionVertIcon } from '../../icons/icons';
import { MainContextMenu } from '../../menu/main-context-menu/main-context-menu';
import { useAppAuthContext } from '../../../contexts/app-auth-context';

export const CommonToolbar = () => {
  const contextMenuRef = useRef<ContextMenu>(null);
  const commonNavbarMenuItems = useCommonNavbarMenuItems();
  const { isAuth } = useAppAuthContext();

  return (
    <>
      <Toolbar visible={isAuth()}>
        <Item
          location={'after'}
          widget={'dxButton'}
          cssClass={'app-rounded-button'}
          options={{
            template: 'extensionMenuTemplate',
            elementAttr: {
              className: 'app-rounded-button',
            },
            onClick: async (e) => {
              if (contextMenuRef.current) {
                const contextMenu = contextMenuRef.current.instance;
                contextMenu.option('target', e.element);
                await contextMenu.show();
              }
            },
          }}
        />

        <Template
          name='extensionMenuTemplate'
          render={() => {
            return <ExtensionVertIcon size={appConstants.appearance.bigIconSize} />;
          }}
        />
      </Toolbar>
      <MainContextMenu
        ref={contextMenuRef}
        items={commonNavbarMenuItems}
      />
    </>
  );
};
