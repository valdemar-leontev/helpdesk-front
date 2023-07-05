import { DialogProps } from './dialog-props';
import { RequirementCategoryTreeItemModel } from '../data/requirement-category-tree-item-model';

export interface EditRequirementCategoryDialogProps extends DialogProps {
    requirementCategory: RequirementCategoryTreeItemModel;

    callback?: () => Promise<void> | void;
}
