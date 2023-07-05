import { Navbar } from '../../components/navbar/navbar';
import { RequirementTemplateProvider, useRequirementTemplateContext } from '../../contexts/requirement-template-context';
import { RequirementTemplatePassageHeader } from './requirement-header/requirement-header';
import { QuestionPassageCardList } from './question-passage-card-list/question-passage-card-list';
import { RequirementTemplatePassageFooter } from './requirement-footer/requirement-footer';
import { UserAnswersProvider } from './user-answers-context';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { appConstants } from '../../constants/app-constants';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';

export const RequirementPageInternal = () => {
  const { currentRequirementTemplate } = useRequirementTemplateContext();
  const [searchParams] = useSearchParams();
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (currentRequirementTemplate) {
        const preview = searchParams.has('preview');

        if (preview) {
          setIsPreviewMode(true);
        }
      }
    })();
  }, [currentRequirementTemplate, searchParams]);

  return (
    currentRequirementTemplate
      ? <div className={'app'}>
        <Navbar>
          <div className='navbar__item navbar__search'>
            <AuthToolbar />
          </div>
          <div className={'navbar__item navbar__search'}>
            <InstructionToolbar />
          </div>
          <div className='navbar__item navbar__search'>
            <CommonToolbar />
          </div>
        </Navbar>

        <RequirementTemplatePassageHeader />
        <QuestionPassageCardList />
        {isPreviewMode
          ? null
          : <RequirementTemplatePassageFooter />
        }
      </div>
      : <>
        <div className={'dx-empty-message'}>{appConstants.strings.noData}</div>
      </>
  );
};

export const RequirementPage = () => {
  return (
    <RequirementTemplateProvider>
      <UserAnswersProvider>
        <RequirementPageInternal />
      </UserAnswersProvider>
    </RequirementTemplateProvider>
  );
};
