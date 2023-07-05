import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { FileUploadDialogProps } from '../../../models/dialogs/file-upload-dialog-props';
import { FileUploadDialogContent } from './file-upload-dialog-content';
import { PopupTitle } from '../popup-title';

export const FileUploadDialog = ({
  mode,
  requirementId,
  callback,
  fileUploadedCallback,
  fileUid,
  fileListUploadedCallback
}: FileUploadDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Прикрепить файлы'} dialogName={'FileUpload'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      className={'about-dialog'}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'auto'}
      maxWidth={600}
      minWidth={600}
      visible={true}
      onHidden={() => {
        showDialog('FileUploadDialog', { visible: false } as FileUploadDialogProps);
        if (callback) {
          callback(true);
        }
      }}
    >
      <FileUploadDialogContent
        fileUid={fileUid}
        requirementId={requirementId}
        callback={callback}
        visible={true}
        mode={mode} 
        fileUploadedCallback={fileUploadedCallback}
        fileListUploadedCallback={fileListUploadedCallback}
      />
    </Popup>
  );
};