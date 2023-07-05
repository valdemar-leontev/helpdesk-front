import Button from 'devextreme-react/ui/button';
import { DataGridIcon, GridIcon, RequirementTemplateIcon } from '../../../components/icons/icons';
import { RequirementTemplateListPageModes } from '../../../models/enums/requirement-template-list-page-modes';
import { useRequirementTemplateListPageContext } from '../requirement-template-list-page-context';
import './requirement-template-list-header.scss';

export const RequirementTemplateListHeader = () => {
  const { requirementTemplateListPageMode, setRequirementTemplateListPageMode } = useRequirementTemplateListPageContext();

  return (
    <div className={'requirement-template-list-header'}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <RequirementTemplateIcon size={22} />
        <span>Шаблоны заявок</span>
      </div>
      {
        requirementTemplateListPageMode === RequirementTemplateListPageModes.tile
          ? <Button className={'app-rounded-button'} key='uniqueKey' onClick={() => setRequirementTemplateListPageMode(RequirementTemplateListPageModes.grid)}>
            <DataGridIcon size={20} />
          </Button>
          : <Button className={'app-rounded-button'} onClick={() => setRequirementTemplateListPageMode(RequirementTemplateListPageModes.tile)}>
            <GridIcon size={20} />
          </Button>
      }
    </div>
  );
};
