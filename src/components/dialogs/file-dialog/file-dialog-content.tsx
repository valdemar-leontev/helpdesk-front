import { Button } from 'devextreme-react/ui/button';
import { FileDialogProps } from '../../../models/dialogs/file-dialog-props';
import { DialogConstants } from '../../../constants/dialog-constants';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { FileListDataGrid } from '../../../pages/files-page/file-list-data-grid';
import { FileListDataGridViewModes } from '../../../models/enums/file-list-data-grid-view-modes';

export const FileDialogContent = ({ currentRequirement, fileDeletedCallback }: FileDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <div>
      <FileListDataGrid requirementId={currentRequirement.id} fileDeletedCallback={fileDeletedCallback} mode={FileListDataGridViewModes.dialog} />

      {
        currentRequirement
          ? <div className='dialog-content__buttons' style={{ margin: 0, padding: 10 }}>
            <Button
              type={'normal'}
              text={DialogConstants.ButtonCaptions.Close}
              onClick={() => showDialog('FileDialog', { visible: false } as DialogProps)}
            />
          </div>
          : null
      }
    </div>
  );
};