import './question-cards-list.scss';
import { QuestionCard } from '../question-card/question-card';
import { QuestionCardContextProvider } from '../../../../contexts/question-card-context';
import { useRequirementTemplateContext } from '../../../../contexts/requirement-template-context';

export const QuestionCardsList = () => {
  const { currentRequirementTemplate } = useRequirementTemplateContext();

  return (
    <>
      <div className={'questionnaire-cars-list'}>
        {currentRequirementTemplate?.questions?.map((question, index) => {
          return (
            <QuestionCardContextProvider key={`question-card-${index}`} questionType={question.questionTypeId}>
              <QuestionCard question={question} />
            </QuestionCardContextProvider>
          );
        })}
      </div>
    </>
  );
};
