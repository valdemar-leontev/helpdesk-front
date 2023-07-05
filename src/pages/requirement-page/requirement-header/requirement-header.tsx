import './requirement-header.scss';
import { useRequirementTemplateContext } from '../../../contexts/requirement-template-context';
import { RequirementCreationInfo } from './requirement-creation-info';

export const RequirementTemplatePassageHeader = () => {
  const { currentRequirementTemplate } = useRequirementTemplateContext();

  return (
    <div className={'card'}>
      <div className={'passage_page__name'}>{ currentRequirementTemplate?.name }</div>
      <div className={'passage_page__description'}>{ currentRequirementTemplate?.description }</div>
      <RequirementCreationInfo />
    </div>
  );
};
