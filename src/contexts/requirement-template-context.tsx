import { createContext, useContext, useEffect, useState } from 'react';
import { RequirementTemplateModel } from '../models/data/requirement-templates-model';
import { RequirementTemplateContextModel } from '../models/contexts/requirement-templates-context-model';
import { RequirementTemplateContextProviderProps } from '../models/contexts/requirement-templates-context-provider-props';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDataContext } from './app-data-context';

const RequirementTemplateContext = createContext<RequirementTemplateContextModel>({} as RequirementTemplateContextModel);

function RequirementTemplateProvider(props: RequirementTemplateContextProviderProps) {
  const [currentRequirementTemplate, setCurrentRequirementTemplate] = useState<RequirementTemplateModel | null>(null);
  const { requirementTemplateId } = useParams();
  const [searchParams] = useSearchParams();
  const [isRequirementReview, setIsRequirementReview] = useState<boolean>(false);
  const { getRequirementTemplateAsync } = useAppDataContext();

  useEffect(() => {
    (async () => {
      const review = searchParams.has('review');

      setIsRequirementReview(review);

      const requirementTemplate = await getRequirementTemplateAsync(requirementTemplateId as any as number);
      setCurrentRequirementTemplate(requirementTemplate);
    })();
  }, [getRequirementTemplateAsync, requirementTemplateId, searchParams]);

  return (
    <RequirementTemplateContext.Provider value={{ currentRequirementTemplate, setCurrentRequirementTemplate, isRequirementReview }} {...props}>
      {props.children}
    </RequirementTemplateContext.Provider>
  );
}

const useRequirementTemplateContext = () => useContext(RequirementTemplateContext);

export { RequirementTemplateProvider, useRequirementTemplateContext };
