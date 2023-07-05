import './variant-adder.scss';
import { TextBox } from 'devextreme-react/ui/text-box';
import { useQuestionCardContext } from '../../../../contexts/question-card-context';
import { SingleSelectAdderProps } from '../../../../models/components/single-select-adder-props';
import { appConstants } from '../../../../constants/app-constants';
import { useIconFactories } from '../../../../components/icons/use-icon-factories';

export const VariantAdder = ({ onAddVariant }: SingleSelectAdderProps) => {

  const { currentQuestionType } = useQuestionCardContext();
  const { QuestionTypeIconFactory } = useIconFactories();

  return (
    <div className={'single-select-adder'}>
      <div className={'single-select-adder_checkbox'} >
        {QuestionTypeIconFactory(currentQuestionType)}
      </div>
      <div className={'single-select-adder_textbox'} onClick={onAddVariant}>
        <TextBox readOnly stylingMode={'underlined'} placeholder={appConstants.strings.addVariant} />
      </div>
    </div>
  );
};
