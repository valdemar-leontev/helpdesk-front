import { Form, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../../user-answers-context';
import { TextAnswerProps } from '../../../../models/components/text-answer-props';
import { useEffect, useRef } from 'react';
import { appConstants } from '../../../../constants/app-constants';

export const TextAnswer = ({ question, isRequirementReview }: TextAnswerProps) => {
  const { currentUserAnswers, setFormRefs } = useUserAnswersContext();
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (formRef && formRef.current) {
      setFormRefs(prevState => [...prevState, formRef]);
    }
  }, [currentUserAnswers, question, setFormRefs]);

  return (
    <Form ref={formRef} formData={currentUserAnswers[`question_${question.id}`]}>
      <SimpleItem
        dataField={'value_0'}
        label={{ visible: false }}
        editorType={'dxTextBox'}
        editorOptions={
          {
            readOnly: isRequirementReview,
            hint: appConstants.strings.myAnswer,
            placeholder: appConstants.strings.myAnswer,
            showClearButton: true,
            stylingMode: 'underlined',
          }
        }
      >
        {question.isRequired ? <RequiredRule message={appConstants.strings.requiredQuestion} /> : null}
      </SimpleItem>
    </Form>
  );
};
