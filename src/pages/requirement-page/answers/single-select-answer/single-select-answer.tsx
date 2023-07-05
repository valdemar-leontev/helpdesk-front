import { Form, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../../user-answers-context';
import { useEffect, useRef } from 'react';
import { SingleSelectAnswerProps } from '../../../../models/components/single-select-answer-props';
import { appConstants } from '../../../../constants/app-constants';

export const SingleSelectAnswer = ({ question, isRequirementReview }: SingleSelectAnswerProps) => {
  const { currentUserAnswers, setFormRefs } = useUserAnswersContext();
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (formRef && formRef.current) {
      setFormRefs(prevState => [...prevState, formRef]);
    }
  }, [setFormRefs]);

  return (currentUserAnswers && currentUserAnswers[`question_${question.id}`] ?
    <Form ref={formRef} formData={currentUserAnswers[`question_${question.id}`]}>
      <SimpleItem
        label={{ visible: false }}
        dataField={'value_0'}
        editorType={'dxRadioGroup'}
        editorOptions={{
          readOnly: isRequirementReview,
          items: question.variants,
          displayExpr: 'description',
          valueExpr: 'id'
        }}
      >
        {question.isRequired ? <RequiredRule message={appConstants.strings.requiredQuestion} /> : null}

      </SimpleItem>
    </Form>
    : null
  );
};
