import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { FileDialogProps } from '../../../models/dialogs/file-dialog-props';
import { FileDialogContent } from './file-dialog-content';
import { PopupTitle } from '../popup-title';

export const FileDialog = (props: FileDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Прикрепленные файлы'} dialogName={'File'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      className={'about-dialog'}
      dragEnabled={true}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={1000}
      minWidth={720}
      visible={true}
      onHidden={() => {
        showDialog('FileDialog', { visible: false } as FileDialogProps);
      }}
    >
      <FileDialogContent {...props} />
    </Popup>
  );
};