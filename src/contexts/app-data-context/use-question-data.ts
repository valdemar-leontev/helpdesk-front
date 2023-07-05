import { useCallback, useMemo } from 'react';
import { QuestionModel } from '../../models/data/question-model';
import { useAuthHttpRequest } from './use-auth-http-request';

export type AppDataContextQuestionEndpointsModel = {
  getQuestionListAsync: (requirementTemplateId: number) => Promise<QuestionModel[]>;

  deleteQuestionAsync: (questionId: number) => Promise<QuestionModel>;
}

export const useQuestionData = () => {
  const authHttpRequest = useAuthHttpRequest();

  const baseRoute = useMemo<string>(() => {
    return '/questions';
  }, []);

  const getQuestionListAsync = useCallback(async (requirementTemplateId: number) => {
    const response = await authHttpRequest({
      url: `${baseRoute}/${requirementTemplateId}`,
      method: 'GET',
    });

    return response ? response.data as QuestionModel[] : null;
  }, [authHttpRequest, baseRoute]);

  const deleteQuestionAsync = useCallback(async (questionId: number) => {
    const response = await authHttpRequest({
      method: 'DELETE',
      url: `${baseRoute}/${questionId}`,
    });

    return response ? response.data : null;
  }, [authHttpRequest, baseRoute]);

  return {
    getQuestionListAsync,
    deleteQuestionAsync
  };
};