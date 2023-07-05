import { FileListDataGridViewModes } from '../enums/file-list-data-grid-view-modes';

export type FileListDataGridProps = {
    requirementId: number | null;

    fileDeletedCallback?: () => Promise<void> | void;

    mode: FileListDataGridViewModes;
}