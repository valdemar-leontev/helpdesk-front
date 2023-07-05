import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { RequirementCommentDialogContent } from './requirement-comment-dialog-content';
import { RequirementCommentDialogProps } from '../../../models/dialogs/requirement-comment-dialog-props';
import { PopupTitle } from '../popup-title';

export const RequirementCommentDialog = ({ callback, buttonText, requirementId, newRequirementState } : RequirementCommentDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Комментарий'} dialogName={'RequirementComment'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      maxWidth={1100}
      minWidth={500}
      height={'auto'}
      visible={true}
      onHidden={() => {
        showDialog('RequirementCommentDialog', { visible: false } as RequirementCommentDialogProps);
      }}
    >
      <RequirementCommentDialogContent buttonText={buttonText} callback={callback} requirementId={requirementId} newRequirementState={newRequirementState}/>
    </Popup>
  );
};
