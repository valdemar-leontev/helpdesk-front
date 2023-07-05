import { ReactNode } from 'react';
import { QuestionTypes } from '../enums/question-types';

export type QuestionCardContextProviderProps = {
    questionType: QuestionTypes;
    children: ReactNode;
}
