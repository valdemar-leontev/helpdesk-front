import './requirement-footer.scss';
import { RequirementFooterButtonsFactory } from './requirement-footer-buttons-factory';

export const RequirementTemplatePassageFooter = () => {
  return (
    <div className={'questionnaire-passage-footer'} >
      <RequirementFooterButtonsFactory />
    </div>
  );
};
