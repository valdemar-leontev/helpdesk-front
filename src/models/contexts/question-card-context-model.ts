import { Dispatch, SetStateAction } from 'react';
import { QuestionTypes } from '../enums/question-types';

export type QuestionCardContextModel = {
    currentQuestionType: QuestionTypes;

    setCurrentQuestionType: Dispatch<SetStateAction<QuestionTypes>>;
}
