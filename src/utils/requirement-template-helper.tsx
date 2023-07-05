import { useCallback } from 'react';
import { RequirementTemplateModel } from '../models/data/requirement-templates-model';
import { useNavigate } from 'react-router';

export const useRequirementTemplateHelper = () => {
  const navigate = useNavigate();

  const createRequirement = useCallback(async (requirementTemplate: RequirementTemplateModel) => {
    navigate(`/requirement/${requirementTemplate.id}`);
  }, [navigate]);

  const showPreview = useCallback((requirementTemplate: RequirementTemplateModel) => {
    navigate(`/requirement/${requirementTemplate.id}/?preview`);
  }, [navigate]);

  return { createRequirement, showPreview };
};
