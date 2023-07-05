import './question-card.scss';
import { useCallback } from 'react';
import { useQuestionCardContext } from '../../../../contexts/question-card-context';
import { QuestionTypes } from '../../../../models/enums/question-types';
import { TextVariant } from '../../variants/text-variant/text-variant';
import { SelectVariant } from '../../variants/select-variant/select-variant';
import { TextAreaVariant } from '../../variants/text-area-variant/text-area-variant';
import { QuestionCardFooter } from './question-card-footer/question-card-footer';
import { QuestionCardProps } from '../../../../models/components/question-card-props';
import { useQuestionTypeItems } from './use-question-type-items';
import { Form, GroupItem, SimpleItem } from 'devextreme-react/ui/form';
import { Template } from 'devextreme-react/core/template';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { useAppDataContext } from '../../../../contexts/app-data-context';
import { useRequirementTemplateContext } from '../../../../contexts/requirement-template-context';
import { appConstants } from '../../../../constants/app-constants';

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const items = useQuestionTypeItems();

  const { currentQuestionType, setCurrentQuestionType } = useQuestionCardContext();
  const { saveRequirementTemplateAsync } = useAppDataContext();
  const { currentRequirementTemplate } = useRequirementTemplateContext();

  const VariantsFactory = useCallback(() => {
    switch (currentQuestionType) {
    case QuestionTypes.text:

      return (
        <TextVariant/>
      );

    case QuestionTypes.multipleSelect:
    case QuestionTypes.singleSelect:
    case QuestionTypes.selectBox:

      return (
        <SelectVariant question={question}/>
      );

    case QuestionTypes.textArea:

      return (
        <TextAreaVariant/>
      );

    default:

      return null;
    }
  }, [currentQuestionType, question]);

  return (
    <div className={'card'}>
      <Form formData={question} onFieldDataChanged={
        async (e: FieldDataChangedEvent) => {
          if (e.dataField === 'questionTypeId') {
            const questionTypeId = e.value;
            setCurrentQuestionType(questionTypeId);
          }
          await saveRequirementTemplateAsync(currentRequirementTemplate!);
        }
      }>
        <GroupItem colCount={2}>
          <SimpleItem
            dataField={'description'}
            isRequired={true}
            label={{ visible: false }}
            editorType={'dxTextBox'}
            editorOptions={
              {
                hint: appConstants.strings.questionName,
                placeholder: appConstants.strings.question,
                showClearButton: true,
                stylingMode: 'fill',
              }
            }
          />

          <SimpleItem
            dataField={'questionTypeId'}
            isRequired={true}
            label={{ visible: false }}
            editorType={'dxSelectBox'}
            editorOptions={
              {
                hint: appConstants.strings.questionType,
                valueExpr: 'questionType',
                displayExpr: 'text',
                dataSource: items,
                dropDownOptions: { height: 285 },
                itemTemplate: 'questionTypeItemTemplate'
              }
            }
          />
        </GroupItem>
        <Template name='questionTypeItemTemplate' render={(itemData) => {
          return (
            <div className={'question-type-item'}>
              <div>{itemData.icon()}</div>
              <div>{itemData.text}</div>
            </div>
          );
        }}/>
      </Form>
      <VariantsFactory/>
      <QuestionCardFooter question={question}/>
    </div>
  );
};
