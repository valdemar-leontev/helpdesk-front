import { Template } from 'devextreme-react/core/template';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import Toolbar, { Item } from 'devextreme-react/ui/toolbar';
import { useCallback, useMemo, useRef } from 'react';
import { appConstants } from '../../../constants/app-constants';
import { AboutIcon, CompanySiteIcon, InstructionIcon, QuestionIcon } from '../../icons/icons';
import { MainContextMenu } from '../../menu/main-context-menu/main-context-menu';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { AboutDialogProps } from '../../../models/dialogs/about-dialogs-props';
import { MenuItemModel } from '../../../models/components/menu-item-model';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';

export const InstructionToolbar = () => {
  const contextMenuRef = useRef<ContextMenu>(null);
  const { downloadFileAsync } = useAppDataContext();
  const { showDialog } = useCommonDialogsContext();

  const onAboutClick = useCallback(() => {
    showDialog('AboutDialog', {
      visible: true
    } as AboutDialogProps);
  }, [showDialog]);

  const additionalMenuItems = useMemo<MenuItemModel[]>(() => {
    return ([
      {
        text: 'Инструкция',
        icon: () => <QuestionIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: async () => {
          await downloadFileAsync(appConstants.helpdeskInstructionUid, true);
        }
      },
      {
        text: appConstants.strings.aboutProgram,
        icon: () => <AboutIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          onAboutClick();
        }
      },
      {
        text: appConstants.strings.companySite,
        icon: () => <CompanySiteIcon size={appConstants.appearance.bigIconSize} color={appConstants.appearance.baseDarkGrey} />,
        onClick: () => {
          window.open('https://ic-eta.ru/', '_blank');
        }
      },
    ]);
  }, [downloadFileAsync, onAboutClick]);

  return (
    <>
      <Toolbar>
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
            return <InstructionIcon size={appConstants.appearance.bigIconSize} />;
          }}
        />
      </Toolbar>
      <MainContextMenu
        ref={contextMenuRef}
        items={additionalMenuItems}
      />
    </>
  );
};
