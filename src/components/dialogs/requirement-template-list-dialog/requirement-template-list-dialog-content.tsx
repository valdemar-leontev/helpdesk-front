import { Button } from 'devextreme-react/ui/button';
import { DialogConstants } from '../../../constants/dialog-constants';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { RequirementTemplateListDataGridModes } from '../../../models/enums/requirement-template-list-data-grid-modes';
import { RequirementTemplateListDataGrid } from '../../grids/requirement-template-list-data-grid';

export const RequirementTemplateList = () => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <RequirementTemplateListDataGrid mode={RequirementTemplateListDataGridModes.dialog} />
        <div className='dialog-content__buttons'>
          <Button
            type={'default'}
            text={DialogConstants.ButtonCaptions.Close}
            onClick={() => showDialog('RequirementTemplateListDialog', { visible: false } as DialogProps)}
          />
        </div>
      </div>
    </>
  );
};

