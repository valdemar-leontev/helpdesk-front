import { Form, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../../user-answers-context';
import { TextAnswerProps } from '../../../../models/components/text-answer-props';
import { useEffect, useRef } from 'react';
import { useTextAreaVariantToolbarItems } from '../../../requirement-template-page/variants/text-area-variant/use-text-area-variant-toolbar-items';
import { appConstants } from '../../../../constants/app-constants';

export const TextAreaAnswer = ({ question, isRequirementReview }: TextAnswerProps) => {
  const { currentUserAnswers, setFormRefs } = useUserAnswersContext();
  const formRef = useRef<Form>(null);
  const toolbarItems = useTextAreaVariantToolbarItems();

  useEffect(() => {
    if (formRef && formRef.current) {
      setFormRefs(prevState => [...prevState, formRef]);
    }
  }, [setFormRefs]);

  return (
    <Form ref={formRef} formData={currentUserAnswers[`question_${question.id}`]}>
      <SimpleItem
        dataField={'value_0'}
        label={{ visible: false }}
        editorType={'dxHtmlEditor'}
        editorOptions={{
          readOnly: isRequirementReview,
          height: 325,
          stylingMode: 'underlined',
          toolbar: {
            multiline: false,
            items: toolbarItems,
          },
        }}
      >
        {question.isRequired ? <RequiredRule message={appConstants.strings.requiredQuestion} /> : null}
      </SimpleItem>
    </Form>
  );
};
