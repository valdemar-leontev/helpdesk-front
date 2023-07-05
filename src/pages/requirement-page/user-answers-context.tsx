import { Form } from 'devextreme-react/ui/form';
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { useRequirementTemplateContext } from '../../contexts/requirement-template-context';
import { Proc } from '../../models/abstracts/common-types';
import { QuestionTypes } from '../../models/enums/question-types';
import { RequirementModel } from '../../models/data/requirement-model';
import { UserAnswerModel } from '../../models/data/user-answer-model';
import { useParams } from 'react-router-dom';
import { useAppDataContext } from '../../contexts/app-data-context';
import { RequirementStates } from '../../models/enums/requirement-states';

export type UserAnswersContextModel = {
  currentUserAnswers: any;

  setCurrentUserAnswers: Dispatch<SetStateAction<any>>;

  formRefs: RefObject<Form>[];

  setFormRefs: Dispatch<SetStateAction<RefObject<Form>[]>>;

  clearUserAnswers: Proc;

  collectUserAnswers: () => RequirementModel;

  requirementNameFormRef: RefObject<Form>;

  requirementCategoryFormRef: RefObject<Form>;

  currentRequirement: RequirementModel;

  fileCount: number;

  setFileCount: Dispatch<SetStateAction<number>>;
}

// TODO: This context is a carrier an important data so that it would be right to rename it to 'RequirementContext'
const UserAnswersContext = createContext<UserAnswersContextModel>({} as UserAnswersContextModel);

function UserAnswersProvider(props: any) {
  const { requirementId } = useParams();
  const { currentRequirementTemplate } = useRequirementTemplateContext();
  const [currentUserAnswers, setCurrentUserAnswers] = useState<UserAnswersContextModel>({} as UserAnswersContextModel);
  const [formRefs, setFormRefs] = useState<RefObject<Form>[]>([]);
  const requirementNameFormRef = useRef<Form>(null);
  const requirementCategoryFormRef = useRef<Form>(null);
  const { getAuthUser } = useAppAuthContext();
  const [currentRequirement, setCurrentRequirement] = useState<RequirementModel>();
  const { getRequirementAsync } = useAppDataContext();
  const [fileCount, setFileCount] = useState<number>(0);

  // We are preparing userAnswer object for filling an original state of form here

  useEffect(() => {
    (async () => {
      const answers = {} as any;
      const authUser = getAuthUser();
      let requirement: RequirementModel | null = null;

      if (currentRequirementTemplate && currentRequirementTemplate.questions && authUser && authUser.profileId) {

        if (requirementId) {
          requirement = await getRequirementAsync(requirementId as any as number);

          if (requirement) {
            setCurrentRequirement(requirement);
            setFileCount(requirement.fileCount);
          }
        }
        else {
          setCurrentRequirement({
            id: 0,
            profileId: authUser.profileId,
            userName: null,
            name: null,
            requirementTemplateId: currentRequirementTemplate!.id,
            requirementCategoryId: null,
            requirementCategoryTypeId: null,
            creationDate: new Date(),
            requirementStateDescription: '',
            userAnswers: [],
            hasAgreement: null,
            withFiles: false,
            fileCount: 0,
            outgoingNumber: 0,
            isArchive: false,
            requirementStateId: RequirementStates.created,
            lastStageProfileName: ''
          });
        }

        for (const question of currentRequirementTemplate.questions) {

          if (question.questionTypeId === QuestionTypes.text
              || question.questionTypeId === QuestionTypes.singleSelect
              || question.questionTypeId === QuestionTypes.selectBox
              || question.questionTypeId === QuestionTypes.textArea) {
            const value = requirement
              ? requirement.userAnswers.find(a => a.questionId === question.id)?.value
              : null;

            answers[`question_${question.id}`] = {
              value_0: [QuestionTypes.singleSelect, QuestionTypes.selectBox].includes(question.questionTypeId) ? Number(value) : value,
              questionTypeId: question.questionTypeId
            };
          }
          else {
            const answer = {};
            answers[`question_${question.id}`] = answer;
            answer['questionTypeId'] = question.questionTypeId;

            for (const variant of question.variants!) {
              // noinspection RedundantConditionalExpressionJS
              answer[`value_${variant.id}`] =
                  requirement && requirement.userAnswers.find(a => a.questionId === question.id && Number(a.value) === variant.id)
                    ? true
                    : false;
            }
          }
        }
      }

      setCurrentUserAnswers(answers);
    })();
  }, [currentRequirementTemplate, getAuthUser, getRequirementAsync, requirementId]);

  const clearUserAnswers = useCallback(() => {
    for (const answer in currentUserAnswers) {
      for (const field in currentUserAnswers[answer]) {
        if (field === 'value_0') {
          currentUserAnswers[answer][field] = null;
        } else if (field.includes('value_')) {
          currentUserAnswers[answer][field] = false;
        }
      }
    }
    setCurrentUserAnswers({ ...currentUserAnswers });
  }, [currentUserAnswers]);

  const collectUserAnswers = useCallback(() => {
    const answersArray = [] as UserAnswerModel[];
    const authUser = getAuthUser();

    if(!authUser || !authUser.profileId) {
      return { ...currentRequirement, userAnswers: answersArray };
    }

    for (const questionFieldName in currentUserAnswers) {
      const question = currentUserAnswers[questionFieldName];
      const questionId = Number(questionFieldName.replace('question_', ''));
      const questionTypeId = Number(question.questionTypeId);

      for (const valueField of Object.keys(question).filter(f => f.includes('value_'))) {
        let a = {
          profileId: getAuthUser()?.profileId,
          questionId: questionId,
        } as any;

        switch (questionTypeId) {
        case QuestionTypes.text:
        case QuestionTypes.textArea:
        {
          a = { ...a, value: question[valueField], variantId: null };
          answersArray.push(a);

          break;
        }
        case QuestionTypes.singleSelect:
        case QuestionTypes.selectBox:
        {
          const variantId = Number(question[valueField]);
          a = { ...a, value: question[valueField], variantId: variantId };
          answersArray.push(a);

          break;
        }
        case QuestionTypes.multipleSelect:
        {
          if (question[valueField] === true) {
            const variantId = Number(valueField.replace('value_', ''));
            a = { ...a, value: variantId, variantId: variantId };
            answersArray.push(a);
          }

          break;
        }
        default:
          break;
        }
      }
    }

    return { ...currentRequirement, userAnswers: answersArray };
  }, [currentRequirement, currentUserAnswers, getAuthUser]);

  return (
    <UserAnswersContext.Provider value={{
      currentUserAnswers,
      setCurrentUserAnswers,
      formRefs,
      setFormRefs,
      clearUserAnswers,
      collectUserAnswers,
      requirementNameFormRef,
      currentRequirement,
      requirementCategoryFormRef,
      fileCount,
      setFileCount
    }} {...props}>
      {props.children}
    </UserAnswersContext.Provider>
  );
}

const useUserAnswersContext = () => useContext(UserAnswersContext);

export { UserAnswersProvider, useUserAnswersContext };
