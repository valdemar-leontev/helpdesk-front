import { FileUploader } from 'devextreme-react/ui/file-uploader';
import { Button } from 'devextreme-react/ui/button';
import './file-upload-dialog.scss';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogConstants } from '../../../constants/dialog-constants';
import { appConstants } from '../../../constants/app-constants';
import { useCallback, useEffect, useState } from 'react';
import { AuthUserModel } from '../../../models/data/auth-user-model';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { FileUploadDialogProps } from '../../../models/dialogs/file-upload-dialog-props';
import { useNavigate } from 'react-router';
import notify from 'devextreme/ui/notify';
import { FileAttachmentModes } from '../../../models/enums/file-attachment-modes';
import { useSearchParams } from 'react-router-dom';

export const FileUploadDialogContent = ({
  mode,
  requirementId,
  fileUploadedCallback,
  fileUid,
  fileListUploadedCallback
}: FileUploadDialogProps) => {
  const { showDialog } = useCommonDialogsContext();
  const { getAuthUser } = useAppAuthContext();
  const [authUser, setAuthUser] = useState<AuthUserModel | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  useEffect(() => {
    const review = searchParams.has('review');
    if (review) {
      setIsReviewMode(true);
    }

    const authUser = getAuthUser();
    setAuthUser(authUser);
  }, [getAuthUser, searchParams]);

  const uploadUrlMaker = useCallback(() => {
    if(mode === FileAttachmentModes.simple) {
      return `${appConstants.webApiRoot}/files/upload/`;
    }

    if (mode === FileAttachmentModes.attachment) {
      return `${appConstants.webApiRoot}/files/upload/${requirementId}`;
    }

    if (mode === FileAttachmentModes.replace) {
      return `${appConstants.webApiRoot}/files/replace/${fileUid}`;
    }
  }, [fileUid, mode, requirementId]);

  return (
    <>
      <div className='upload-dialog-content'>
        <FileUploader
          width={'100%'}
          uploadButtonText={'Прикрепить'}
          selectButtonText={'Выбрать...'}
          dropZone={'#dropzone-external'}
          labelText={'или Перетащить файл сюда'}
          accept={'*'}
          multiple={mode !== FileAttachmentModes.replace}
          uploadMethod={'POST'}
          uploadMode={'useButtons'}
          uploadUrl={uploadUrlMaker() as string}
          uploadHeaders={{
            'Authorization': `Bearer ${authUser?.token}`
          }}
          onFilesUploaded={() => {
            if (fileListUploadedCallback) {
              fileListUploadedCallback();
            }

            setTimeout(() => {
              if (!isReviewMode && mode === FileAttachmentModes.attachment) {
                navigate('/requirements');
              }
              notify('Файлы были успешно прикреплены.', 'success', 3000);
              showDialog('FileUploadDialog', { visible: false } as FileUploadDialogProps);
            }, 1500);
          }}
          onUploaded={(e) => {
            if (fileUploadedCallback && e.request && e.request.status == 200) {
              fileUploadedCallback();
            }
          }}
        />
      </div>

      <div className='dialog-content__buttons'>
        <Button
          type={'normal'}
          text={DialogConstants.ButtonCaptions.Close}
          onClick={() => {
            if (mode === FileAttachmentModes.attachment && !isReviewMode) {
              navigate('/requirements');
            }

            showDialog('FileUploadDialog', { visible: false } as DialogProps);
          }}
        />
      </div>
    </>
  );
};