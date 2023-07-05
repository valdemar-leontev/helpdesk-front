import { PromptDialogCallback } from '../../../models/dialogs/prompt-dialog-props';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { useCallback, useRef } from 'react';
import { useTextAreaVariantToolbarItems } from '../../../pages/requirement-template-page/variants/text-area-variant/use-text-area-variant-toolbar-items';
import { Button } from 'devextreme-react/ui/button';
import { RequirementCommentDialogProps } from '../../../models/dialogs/requirement-comment-dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { RequirementCommentModel } from '../../../models/data/requirement-comment-model';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { showConfirmDialog } from '../../../utils/common-dialogs';
import { appConstants } from '../../../constants/app-constants';
import notify from 'devextreme/ui/notify';
import { useNavigate } from 'react-router';
import { RequirementStates } from '../../../models/enums/requirement-states';

export const RequirementCommentDialogContent = ({ buttonText, requirementId, newRequirementState }: { callback: PromptDialogCallback, buttonText: string, requirementId: number, newRequirementState: RequirementStates }) => {
  const formRef = useRef<Form>(null);
  const toolbarItems = useTextAreaVariantToolbarItems();
  const { showDialog } = useCommonDialogsContext();
  const formData = useRef<string>('');
  const { postRequirementStateAsync } = useAppDataContext();
  const navigate = useNavigate();

  const onSaveRequirementStateAsync = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.confirm,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'RequirementIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите ответить на заявку?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (dialogResult) {
          const newRequirementComment = {
            id: 0,
            description: (formData as any).value_0,
            senderProfileId: 0,
          } as RequirementCommentModel;

          const requirement = await postRequirementStateAsync(requirementId, newRequirementState, newRequirementComment);

          if (requirement) {
            notify('Ответ на заявку был успешно создан.', 'success', 3000);
            showDialog('RequirementCommentDialog', { visible: false } as RequirementCommentDialogProps);
            navigate('/requirements');
          }
        } else {
          showDialog('RequirementCommentDialog', { visible: false } as RequirementCommentDialogProps);
        }
      }
    });
  }, [navigate, newRequirementState, postRequirementStateAsync, requirementId, showDialog]);

  return (
    <>
      <Form
        ref={formRef}
        formData={formData}
      >
        <SimpleItem
          dataField={'value_0'}
          label={{ visible: false }}
          editorType={'dxHtmlEditor'}
          editorOptions={{
            height: 425,
            stylingMode: 'underlined',
            toolbar: {
              multiline: false,
              items: toolbarItems,
            }
          }}
        />
      </Form>

      <div className='dialog-content__buttons'>
        <Button
          text={buttonText}
          stylingMode={'contained'}
          type={'default'}
          onClick={async () => {
            await onSaveRequirementStateAsync();
          }}
        />
        <Button
          text={'Отмена'}
          stylingMode={'contained'}
          type={'normal'}
          onClick={() => {
            showDialog('RequirementCommentDialog', { visible: false } as RequirementCommentDialogProps);
          }}
        />
      </div>
    </>
  );
};
