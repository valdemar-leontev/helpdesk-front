import './question-passage-card.scss';
import { useCallback } from 'react';
import { QuestionModel } from '../../../models/data/question-model';
import { QuestionTypes } from '../../../models/enums/question-types';
import { useQuestionCardContext } from '../../../contexts/question-card-context';
import { TextAnswer } from '../answers/text-answer/text-answer';
import { SingleSelectAnswer } from '../answers/single-select-answer/single-select-answer';
import { MultipleSelectAnswer } from '../answers/multiple-select-answer/multiple-select-answer';
import { SelectBoxAnswer } from '../answers/select-box-answer/select-box-answer';
import { TextAreaAnswer } from '../answers/text-area-answer/text-area-answer';

export type QuestionPassageCardProps = {
  question: QuestionModel;

  isRequirementReview: boolean;
}

export const QuestionPassageCard = ({ question, isRequirementReview }: QuestionPassageCardProps) => {

  const { currentQuestionType } = useQuestionCardContext();

  const AnswersFactory = useCallback(() => {
    switch (currentQuestionType) {
    case QuestionTypes.text:

      return (
        <TextAnswer question={question} isRequirementReview={isRequirementReview}  />
      );

    case QuestionTypes.multipleSelect:

      return (
        <MultipleSelectAnswer question={question} isRequirementReview={isRequirementReview}  />
      );

    case QuestionTypes.singleSelect:

      return (
        <SingleSelectAnswer question={question} isRequirementReview={isRequirementReview}  />
      );

    case QuestionTypes.selectBox:

      return (
        <SelectBoxAnswer question={question} isRequirementReview={isRequirementReview}  />
      );

    case QuestionTypes.textArea:

      return (
        <TextAreaAnswer question={question} isRequirementReview={isRequirementReview}  />
      );
    default:

      return null;
    }
  }, [currentQuestionType, isRequirementReview, question]);

  return (
    <div className={'card'}>
      <div className={'passage-card-description'}>{question.description}</div>
      <AnswersFactory />
    </div>
  );
};
