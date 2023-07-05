import { Form, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../../user-answers-context';
import { useRef, useEffect } from 'react';
import { SingleSelectAnswerProps } from '../../../../models/components/single-select-answer-props';
import { appConstants } from '../../../../constants/app-constants';

export const SelectBoxAnswer = ({ question, isRequirementReview }: SingleSelectAnswerProps) => {
  const { currentUserAnswers, setFormRefs } = useUserAnswersContext();
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (formRef && formRef.current) {
      setFormRefs(prevState => [...prevState, formRef]);
    }
  }, [setFormRefs]);

  return (
    <Form ref={formRef} formData={currentUserAnswers[`question_${question.id}`]}>
      return (
      <SimpleItem
        dataField={'value_0'}
        label={{ visible: false }}
        editorType={'dxSelectBox'}
        editorOptions={{
          readOnly: isRequirementReview,
          dropDownOptions: { height: 285 },
          dataSource: question.variants ?? [],
          valueExpr: 'id',
          displayExpr: 'description',
        }}
      >
        {question.isRequired ? <RequiredRule message={appConstants.strings.requiredQuestion} /> : null}
      </SimpleItem>
      );
    </Form>
  );
};
