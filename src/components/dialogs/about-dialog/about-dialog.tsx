import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { AboutDialogProps } from '../../../models/dialogs/about-dialogs-props';
import { AboutDialogContent } from './about-dialog-content';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { PopupTitle } from '../popup-title';

// eslint-disable-next-line no-empty-pattern
export const AboutDialog = ({  }: DialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'О программе'} dialogName={'About'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      className={'about-dialog'}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={500}
      minWidth={320}
      visible={true}
      onHidden={() => {
        showDialog('AboutDialog', { visible: false } as AboutDialogProps);
      }}
    >
      <AboutDialogContent />
    </Popup>
  );
};