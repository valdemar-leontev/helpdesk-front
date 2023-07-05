import { RequirementTemplateHeader } from './requirement-template/requirement-template-header/requirement-template-header';
import { QuestionCardsList } from './requirement-template/question-cards-list/question-cards-list';
import { useCallback } from 'react';
import { useAppDataContext } from '../../contexts/app-data-context';
import { RequirementTemplateProvider, useRequirementTemplateContext } from '../../contexts/requirement-template-context';
import { SpeedDialAction } from 'devextreme-react/ui/speed-dial-action';
import { QuestionTypes } from '../../models/enums/question-types';
import { Navbar } from '../../components/navbar/navbar';
import notify from 'devextreme/ui/notify';
import { QuestionModel } from '../../models/data/question-model';
import { appConstants } from '../../constants/app-constants';
import { RequirementTemplateToolbar } from './requirement-template-toolbar/requirement-template-toolbar';

const RequirementTemplatePageInternal = () => {
  const { currentRequirementTemplate, setCurrentRequirementTemplate } = useRequirementTemplateContext();
  const { saveRequirementTemplateAsync } = useAppDataContext();

  const onAddQuestionCardAsync = useCallback(async () => {
    if (!currentRequirementTemplate || !currentRequirementTemplate.questions) {
      return;
    }

    const createdQuestion = {
      id: 0,
      description: '',
      questionTypeId: QuestionTypes.singleSelect,
      requirementTemplateId: currentRequirementTemplate.id,
      variants: [
        {
          id: 0,
          description: ''
        }
      ]
    } as QuestionModel;
    const savedRequirementTemplate = await saveRequirementTemplateAsync({
      ...currentRequirementTemplate,
      questions: [...currentRequirementTemplate.questions, createdQuestion]
    });

    if (savedRequirementTemplate && savedRequirementTemplate.questions) {
      let newQuestionIdList = savedRequirementTemplate.questions.map(q => q.id);
      const oldQuestionIdList = currentRequirementTemplate.questions.map(q => q.id);

      newQuestionIdList = newQuestionIdList.filter(id => {
        return !oldQuestionIdList.includes(id);
      });

      const newQuestionId = newQuestionIdList.find(() => true);

      if (newQuestionId && createdQuestion.variants) {
        createdQuestion.id = newQuestionId;
        const createdVariant = createdQuestion.variants.find(() => true);
        if (createdVariant) {
          createdVariant.id = savedRequirementTemplate.questions.find(q => q.id === newQuestionId)!.variants![0].id;
        }

        setCurrentRequirementTemplate((prevState) => {
          if (!prevState) {

            return prevState;
          }

          return {
            ...prevState,
            questions: [
              ...(prevState.questions ?? []),
              createdQuestion
            ]
          };
        });
      }
    }
  }, [currentRequirementTemplate, saveRequirementTemplateAsync, setCurrentRequirementTemplate]);

  return (
    <div className={'app'}>
      <Navbar>
        <div className='navbar__item navbar__search'>
          <RequirementTemplateToolbar />
        </div>
      </Navbar>
      <div className={'app_questionnaire'}>
        {currentRequirementTemplate
          ?
          <>
            <RequirementTemplateHeader />
            <QuestionCardsList />
          </>
          :
          <>
            <div className={'dx-empty-message'}>{appConstants.strings.noData}</div>
          </>
        }
      </div>

      {currentRequirementTemplate
        ?
        <>
          <SpeedDialAction icon={'add'} label={appConstants.strings.add} onClick={async () => {
            await onAddQuestionCardAsync();
            notify(appConstants.strings.questionCreated, 'success', 3000);
            const timer = setTimeout(() => {
              window.scrollTo(0, document.body.scrollHeight);
              clearTimeout(timer);
            }, 100);
          }} />
          <SpeedDialAction icon={'save'} label={appConstants.strings.save} onClick={async () => {
            await saveRequirementTemplateAsync(currentRequirementTemplate);
            notify(appConstants.strings.requirementSaved, 'success', 3000);
          }} />
        </>
        :
        null
      }

    </div>
  );
};

export const RequirementTemplatePage = () => {
  return (
    <RequirementTemplateProvider>
      <RequirementTemplatePageInternal />
    </RequirementTemplateProvider>
  );
};
