import { Button } from 'devextreme-react/ui/button';
import { FileAttachmentModes } from '../../../models/enums/file-attachment-modes';
import { FileUploadDialogProps } from '../../../models/dialogs/file-upload-dialog-props';
import { FileUploadIcon } from '../../../components/icons/icons';
import { FileDialogProps } from '../../../models/dialogs/file-dialog-props';
import { useUserAnswersContext } from '../user-answers-context';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { useAppAuthContext } from '../../../contexts/app-auth-context';

export const FileManagementLink = () => {
  const { currentRequirement } = useUserAnswersContext();
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();
  const { fileCount, setFileCount } = useUserAnswersContext();
    
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, alignItems: 'center', gap: 5 }}>
      <Button
        visible={currentRequirement.profileId === getAuthUser()!.profileId}
        type={'default'}
        className={'app-command-button-small'}
        onClick={() => {
          showDialog('FileUploadDialog', { visible: true, requirementId: currentRequirement.id, mode: FileAttachmentModes.attachment, fileUploadedCallback: () => {
            setFileCount(prevState => prevState + 1);
          } } as FileUploadDialogProps);
        }}
      >
        <FileUploadIcon size={20} />
      </Button>
      <a style={{ cursor: 'pointer' }} onClick={() => {
        showDialog('FileDialog', { visible: true, currentRequirement: currentRequirement, fileDeletedCallback: () => {
          setFileCount(prevState => prevState - 1);
        } } as FileDialogProps);
      }}>
        {
          fileCount === 0
            ? 'Прикрепленные файлы отсутствуют.'
            : `Показать ${fileCount} файл(ов).`
        }
      </a>
    </div>
  );
};