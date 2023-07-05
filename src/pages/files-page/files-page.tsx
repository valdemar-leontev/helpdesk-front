import { Navbar } from '../../components/navbar/navbar';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { FolderIcon } from '../../components/icons/icons';
import { appConstants } from '../../constants/app-constants';
import { FileListDataGrid } from './file-list-data-grid';
import { FileListDataGridViewModes } from '../../models/enums/file-list-data-grid-view-modes';

export const FilesPage = () => {

  return (
    <div className={'app-content-card'}>
      <Navbar>
        <div className={'navbar__item navbar__search'}>
          <AuthToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <NotificationToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <InstructionToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <CommonToolbar />
        </div>
      </Navbar>

      <div className={'app-card'}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <FolderIcon size={appConstants.appearance.bigIconSize} />
          <span className={'data-grid-header'}>Файлы</span>
        </div>

        <FileListDataGrid
          requirementId={null} 
          mode={FileListDataGridViewModes.page} />
      </div>
    </div>
  );
};