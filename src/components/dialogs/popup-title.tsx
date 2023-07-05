import { PopupTitleProps } from '../../models/dialogs/popup-title-props';
import { Button } from 'devextreme-react/ui/button';
import { DialogProps } from '../../models/dialogs/dialog-props';
import { CloseIcon } from '../icons/icons';
import { appConstants } from '../../constants/app-constants';
import { useIconFactories } from '../icons/use-icon-factories';
import { useCommonDialogsContext } from '../../contexts/common-dialog-context';

export const PopupTitle = ({ text, dialogName }: PopupTitleProps) => {
  const { PopupTitleIconFactory } = useIconFactories();

  const { showDialog } = useCommonDialogsContext();

  return (
    <div className={'app-popup-title'}>
      <div className={'app-popup-title_info'}>
        {PopupTitleIconFactory(dialogName)}
        <p className={'app-popup-title_info_text'}>{ text }</p>
      </div>

      <Button
        className={'app-command-button'}
        onClick={() => {
          showDialog(`${dialogName}Dialog`, { visible: false } as DialogProps);
        }}
      >
        <CloseIcon size={appConstants.appearance.normalIconSize} />
      </Button>
    </div>
  );
};