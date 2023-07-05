import { useMemo } from 'react';
import { QuestionTypes } from '../../../../models/enums/question-types';
import { DropdownIcon, ShortTextIcon, MultipleSelectIcon, SingleSelectIcon, TextAreaIcon } from '../../../../components/icons/icons';
import { appConstants } from '../../../../constants/app-constants';

export type QuestionTypeSelectBoxItemModel = {
  questionType: QuestionTypes,
  icon: () => JSX.Element,
  text: string
}

export const useQuestionTypeItems = () => {
  return useMemo<QuestionTypeSelectBoxItemModel[]>(() => {
    const iconProps = {
      size: appConstants.appearance.bigIconSize,
      color: appConstants.appearance.baseDarkGrey
    };

    return [
      {
        questionType: QuestionTypes.textArea,
        icon: () => <TextAreaIcon {...iconProps} />,
        text: appConstants.strings.detailedResponseTitle,
      },
      {
        questionType: QuestionTypes.text,
        icon: () => <ShortTextIcon {...iconProps} />,
        text: appConstants.strings.text,
      },
      {
        questionType: QuestionTypes.singleSelect,
        icon: () => <SingleSelectIcon {...iconProps} />,
        text: appConstants.strings.singleSelectTitle,
      },
      {
        questionType: QuestionTypes.multipleSelect,
        icon: () => <MultipleSelectIcon {...iconProps} />,
        text: appConstants.strings.multipleSelectTitle,
      },
      {
        questionType: QuestionTypes.selectBox,
        icon: () => <DropdownIcon {...iconProps} />,
        text: appConstants.strings.dropDownListTitle,
      },
    ] as QuestionTypeSelectBoxItemModel[];
  }, []);
};
