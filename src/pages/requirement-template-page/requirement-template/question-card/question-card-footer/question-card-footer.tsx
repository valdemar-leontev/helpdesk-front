import './question-card-footer.scss';
import { CopyIcon, DeleteIcon } from '../../../../../components/icons/icons';
import { Button } from 'devextreme-react/ui/button';
import { Switch } from 'devextreme-react/ui/switch';
import { useCallback } from 'react';
import { useRequirementTemplateContext } from '../../../../../contexts/requirement-template-context';
import { QuestionCardFooterProps } from '../../../../../models/components/question-card-footer-props';
import { useAppDataContext } from '../../../../../contexts/app-data-context';
import { QuestionModel } from '../../../../../models/data/question-model';
import notify from 'devextreme/ui/notify';
import { showConfirmDialog } from '../../../../../utils/common-dialogs';
import { appConstants } from '../../../../../constants/app-constants';

export const QuestionCardFooter = ({ question }: QuestionCardFooterProps) => {

  const { currentRequirementTemplate, setCurrentRequirementTemplate } = useRequirementTemplateContext();
  const { saveRequirementTemplateAsync } = useAppDataContext();

  const { deleteQuestionAsync } = useAppDataContext();

  const deleteQuestionLocal = useCallback(() => {
    setCurrentRequirementTemplate(prevState => {
      if (prevState && prevState.questions) {
        return (
          {
            ...prevState,
            questions: [...prevState.questions.filter((q) => q.id !== question.id)]
          }
        );
      }

      return prevState;
    });
  }, [question.id, setCurrentRequirementTemplate]);

  const onDeleteQuestionAsync = useCallback(async () => {
    let deletedQuestion: QuestionModel | null = null;

    if (question.id !== 0) {
      deletedQuestion = await deleteQuestionAsync(question.id);
      if (deletedQuestion) {
        deleteQuestionLocal();
      }
    } else {
      deleteQuestionLocal();
    }
  }, [deleteQuestionAsync, deleteQuestionLocal, question.id]);

  const onCloneQuestionAsync = useCallback(async () => {

    setCurrentRequirementTemplate((prevState) => {
      if (prevState) {
        const clonedQuestion = {
          ...question,
          id: 0,
          variants: question.variants!.map(variant => { return { ...variant, id: 0 }; })
        } as QuestionModel;
        const changedRequirementTemplate = { ...prevState, questions: [...prevState.questions!, clonedQuestion] };

        (async () => {
          const savedRequirementTemplate = await saveRequirementTemplateAsync(changedRequirementTemplate);
          setCurrentRequirementTemplate(savedRequirementTemplate);
        })();

        return prevState;
      }

      return prevState;
    });
  }, [question, saveRequirementTemplateAsync, setCurrentRequirementTemplate]);

  return (
    <div className={'card-footer'}>
      <div className={'card-footer_settings'}>
        <div className={'card-footer_settings_icons'}>
          <Button
            className={'app-rounded-button'}
            hint={appConstants.strings.clone}
            onClick={async () => {
              await onCloneQuestionAsync();
              const timer = setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
                clearTimeout(timer);
              }, 100);
              notify(appConstants.strings.questionCloned, 'success', 3000);
            }}>
            <CopyIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />
          </Button>
          <Button
            className={'app-rounded-button'}
            hint={appConstants.strings.delete}
            onClick={async () => {
              showConfirmDialog({
                title: appConstants.strings.deleting,
                iconColor: appConstants.appearance.baseDarkGrey,
                iconName: 'DeleteIcon',
                iconSize: appConstants.appearance.hugeIconSize,
                textRender: () => {
                  return (
                    <span>Действительно хотите удалить вопрос?</span>
                  );
                },
                callback: async (dialogResult?: boolean) => {
                  if (!dialogResult) {
                    return;
                  }

                  await onDeleteQuestionAsync();
                  notify(appConstants.strings.questionDeleted, 'success', 3000);
                }
              });
            }}>
            <DeleteIcon size={appConstants.appearance.normalIconSize} color={appConstants.appearance.baseDarkGrey} />
          </Button>
        </div>
        <div className={'card-footer_settings_mandatory-question'}>
          <span>Обязательный вопрос</span>
          <Switch defaultValue={question.isRequired} onValueChanged={async (e) => {
            question.isRequired = e.value;
            await saveRequirementTemplateAsync(currentRequirementTemplate!);
          }} />
        </div>
      </div>
    </div>
  );
};
