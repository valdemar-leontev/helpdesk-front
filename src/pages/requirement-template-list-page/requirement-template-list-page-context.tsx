import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RequirementTemplateModel } from '../../models/data/requirement-templates-model';
import { RequirementTemplateListPageContextModel } from '../../models/contexts/requirement-templates-page-context-model';
import { useAppDataContext } from '../../contexts/app-data-context';
import { v1 as uuid } from 'uuid';
import { RequirementTemplateListPageModes } from '../../models/enums/requirement-template-list-page-modes';

const RequirementTemplateListPageContext = createContext<RequirementTemplateListPageContextModel>({} as RequirementTemplateListPageContextModel);

function RequirementTemplateListPageProvider(props: any) {
  const { getRequirementTemplateListAsync } = useAppDataContext();
  const [requirementTemplateList, setRequirementTemplateList] = useState<RequirementTemplateModel[]>([]);
  const [refreshStateTag, setRefreshStateTag] = useState<string | undefined>();
  const [requirementTemplateListPageMode, setRequirementTemplateListPageMode] = useState<RequirementTemplateListPageModes>(RequirementTemplateListPageModes.tile);
  const currentRequirementTemplateListItemRef = useRef<RequirementTemplateModel | null>(null);

  const refreshRequirementTemplateList = useCallback(() => {
    setRefreshStateTag(uuid());
  }, []);

  useEffect(() => {
    (async () => {
      const requirementTemplates = await getRequirementTemplateListAsync();
      if (requirementTemplates) {
        setRequirementTemplateList(requirementTemplates);
      }
    })();
  }, [getRequirementTemplateListAsync, refreshStateTag]);

  return (
    <RequirementTemplateListPageContext.Provider value={{
      requirementTemplateList,
      setRequirementTemplateList,
      refreshRequirementTemplateList,
      requirementTemplateListPageMode,
      setRequirementTemplateListPageMode,
      currentRequirementTemplateListItemRef,
    }} {...props}>
      {props.children}
    </RequirementTemplateListPageContext.Provider>
  );
}

const useRequirementTemplateListPageContext = () => useContext(RequirementTemplateListPageContext);

export { RequirementTemplateListPageProvider, useRequirementTemplateListPageContext };
