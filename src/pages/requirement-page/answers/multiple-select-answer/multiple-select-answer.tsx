import { CustomRule, Form, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../../user-answers-context';
import { useRef, useEffect } from 'react';
import validationEngine from 'devextreme/ui/validation_engine';
import { SingleSelectAnswerProps } from '../../../../models/components/single-select-answer-props';
import { appConstants } from '../../../../constants/app-constants';

export const MultipleSelectAnswer = ({ question, isRequirementReview }: SingleSelectAnswerProps) => {
  const { currentUserAnswers, setFormRefs } = useUserAnswersContext();
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (formRef && formRef.current) {
      setFormRefs(prevState => [...prevState, formRef]);
    }
  }, [currentUserAnswers, question, setFormRefs]);

  return (
    <Form ref={formRef} formData={currentUserAnswers[`question_${question.id}`]}
      onFieldDataChanged={() => {
        validationEngine.getGroupConfig('multipleSelectValidationGroup').validators.forEach((validator: any) => {
          validator.validate();
        });
      }}
      validationGroup={'multipleSelectValidationGroup'}
    >
      {question.variants?.map((variant, index) => {
        return (
          <SimpleItem
            dataField={`value_${variant.id}`}
            key={variant.id}
            label={{ visible: false }}
            editorType={'dxCheckBox'}
            editorOptions={{ text: variant.description, readOnly: isRequirementReview }}
          >
            {question.isRequired ?
              <CustomRule
                reevaluate
                message={question.variants!.length - 1 === index ? appConstants.strings.requiredQuestion : ''}
                validationCallback={() => {
                  const formData = formRef.current?.instance.option('formData');
                  // noinspection UnnecessaryLocalVariableJS
                  const isValid = Object.keys(formData)
                    .filter(f => f.startsWith('value_'))
                    .map(f => formData[f])
                    .reduce((prev, curr) => prev || curr);

                  return isValid;
                }
                } />
              : null
            }

          </SimpleItem>
        );
      })}
    </Form>
  );
};
