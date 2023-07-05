import { useRequirementTemplateContext } from '../../../contexts/requirement-template-context';
import { QuestionPassageCard } from '../question-passage-card/question-passage-card';
import { QuestionCardContextProvider } from '../../../contexts/question-card-context';
import { Form, RequiredRule, SimpleItem } from 'devextreme-react/ui/form';
import { useUserAnswersContext } from '../user-answers-context';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { useCallback, useEffect, useState } from 'react';
import { RequirementCategoryModel } from '../../../models/data/requirement-category-model';
import { DictionaryBaseModel } from '../../../models/abstracts/dictionary-base-model';
import { RequirementStateAgreedIcon } from '../../../components/icons/icons';
import { Template } from 'devextreme-react/core/template';
import '../requirement-page.scss';
import { useAppAuthContext } from '../../../contexts/app-auth-context';
import { FileManagementLink } from './file-management-link';
import { appConstants } from '../../../constants/app-constants';

export const QuestionPassageCardList = () => {
  const { currentRequirementTemplate, isRequirementReview } = useRequirementTemplateContext();
  const { currentRequirement, requirementCategoryFormRef } = useUserAnswersContext();
  const { getRequirementCategoriesAsync, getRequirementOutgoingNumberAsync } = useAppDataContext();
  const [currentRequirementCategories, setCurrentRequirementCategories] = useState<RequirementCategoryModel[] | DictionaryBaseModel[] | null>([]);
  const [requirementName, setRequirementName] = useState<string | null>();
  const { getAuthUser } = useAppAuthContext();

  useEffect(() => {
    (async () => {
      if (currentRequirement) {
        if (!currentRequirementTemplate?.hasRequirementCategory) {
          if (currentRequirement.name) {
            setRequirementName(currentRequirement.name);
          } else {
            const requirementOutgoingNumber = await getRequirementOutgoingNumberAsync();
            setRequirementName(`Заявка ${requirementOutgoingNumber}`);
          }
        } else {
          setRequirementName(currentRequirement.name ? currentRequirement.name : null);
        }
      }

      const categories = await getRequirementCategoriesAsync();
      if (categories) {
        setCurrentRequirementCategories(categories);
      }
    })();
  }, [currentRequirement, currentRequirementTemplate?.hasRequirementCategory, getRequirementCategoriesAsync, getRequirementOutgoingNumberAsync]);

  const isFileLinkShowed = useCallback(() => {
    if (currentRequirement) {
      if (!currentRequirement.id) {

        return false;
      }

      if (currentRequirement.profileId !== getAuthUser()?.profileId && currentRequirement.fileCount === 0) {

        return  false;
      }
    }

    return true;
  }, [currentRequirement, getAuthUser]);

  return (
    currentRequirement && currentRequirementCategories && currentRequirementTemplate
      ? <div>
        <div className={'card'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
          <div className={'passage-card-description'}>Наименование заявки:</div>
          <span className={'passage-card-description'} style={{ color: '#a5a5a5' }}>
            {
              !requirementName ?
                'Наименование в соответствии с категорией'
                : requirementName
            }
          </span>
        </div>

        <div className={'card'} style={currentRequirementTemplate?.hasRequirementCategory ? { } : { display: 'none' }}>
          <div className={'passage-card-description'}>Категория заявки</div>
          <Form
            ref={requirementCategoryFormRef}
            formData={currentRequirement}
            visible={currentRequirementTemplate?.hasRequirementCategory}
          >
            <SimpleItem
              dataField={'requirementCategoryId'}
              label={{ visible: false }}
              editorType={'dxSelectBox'}
              editorOptions={{
                searchEnabled: true,
                dropDownOptions: { height: 285 },
                dataSource: currentRequirementCategories,
                valueExpr: 'id',
                displayExpr: 'description',
                itemTemplate: 'requirementCategoryItemTemplate',
                readOnly: isRequirementReview,
                onValueChanged: async (e) => {
                  const requirementCategory = currentRequirementCategories?.find(r => r.id == e.value);
                  if (requirementCategory) {
                    const requirementOutgoingNumber = await getRequirementOutgoingNumberAsync();

                    const name = `${requirementCategory.description} №${requirementOutgoingNumber}`;
                    setRequirementName(name);
                  }
                }
              }}
            >
              {
                currentRequirementTemplate?.hasRequirementCategory
                  ? <RequiredRule  message={appConstants.strings.requiredQuestion}/>
                  : null
              }
            </SimpleItem>

            <Template name='requirementCategoryItemTemplate' render={(itemData: RequirementCategoryModel) => {
              return (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <span>{itemData.requirementCategoryTypeDescription} / {itemData.description}</span>
                  {itemData.hasAgreement
                    ? <div title="Заявка с согласованием">
                      <RequirementStateAgreedIcon size={20}/>
                    </div>
                    : null
                  }
                </div>
              );
            }}/>
          </Form>
        </div>
        {currentRequirementTemplate?.questions?.map((question) => {
          return (
            <QuestionCardContextProvider key={question.id} questionType={question.questionTypeId}>
              <QuestionPassageCard isRequirementReview={isRequirementReview} question={question}/>
            </QuestionCardContextProvider>
          );
        })}

        {
          isFileLinkShowed()
            ? <FileManagementLink />
            : null
        }
      </div>
      : null // TODO: No data to display
  );
};
