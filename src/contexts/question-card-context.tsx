import { createContext, useContext, useState } from 'react';
import { QuestionCardContextModel } from '../models/contexts/question-card-context-model';
import { QuestionCardContextProviderProps } from '../models/contexts/question-card-context-provider-props';
import { QuestionTypes } from '../models/enums/question-types';

const QuestionCardContext = createContext<QuestionCardContextModel>({} as QuestionCardContextModel);

function QuestionCardContextProvider(props : QuestionCardContextProviderProps) {
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionTypes>(props.questionType);

  return (
    <QuestionCardContext.Provider value={
      { currentQuestionType, setCurrentQuestionType }
    } {...props}/>
  );
}

const useQuestionCardContext = () => useContext(QuestionCardContext);

export { QuestionCardContextProvider, useQuestionCardContext };
