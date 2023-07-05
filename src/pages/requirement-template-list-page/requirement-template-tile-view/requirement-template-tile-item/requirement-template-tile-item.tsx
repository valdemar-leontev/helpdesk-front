import './requirement-template-tile-item.scss';
import { CalendarIcon } from '../../../../components/icons/icons';
import { useNavigate } from 'react-router';
import { RequirementTemplateTileItemProps } from '../../../../models/components/requirement-templates-tile-item-props';
import { appConstants } from '../../../../constants/app-constants';
import { useAppAuthContext } from '../../../../contexts/app-auth-context';
import { useRequirementTemplateHelper } from '../../../../utils/requirement-template-helper';

export const RequirementTemplateTileItem = ({ children, requirementTemplate }: RequirementTemplateTileItemProps) => {
  const navigate = useNavigate();
  const { createRequirement } = useRequirementTemplateHelper();
  const { isAdmin } = useAppAuthContext();

  return (
    <div className={'questionnaire-page_questionnaire'}>
      <div className={'questionnaire-page_questionnaire_desc'}
        onClick={async () => {
          isAdmin()
            ? navigate(`/requirement-template/${requirementTemplate.id}`, {
              state: requirementTemplate
            })
            : await createRequirement(requirementTemplate);
        }}
      >
        <div>{requirementTemplate.name}</div>
        <div>{requirementTemplate.description}</div>
      </div>
      <div className={'questionnaire-page_questionnaire_additional-info'}>
        <div>
          <CalendarIcon size={appConstants.appearance.normalIconSize} />
          <div>{requirementTemplate.updateDate.toLocaleString('ru-RU', { dateStyle: 'medium' })}</div>
        </div>
        {children}
      </div>
    </div>
  );
};
