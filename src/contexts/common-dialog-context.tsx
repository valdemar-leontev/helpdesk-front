import { createContext, useContext, useState, useCallback, useMemo, SetStateAction, Dispatch } from 'react';
import { DialogProps } from '../models/dialogs/dialog-props';
import { PromptDialog } from '../components/dialogs/prompt-dialog/prompt-dialog';
import { PromptDialogProps } from '../models/dialogs/prompt-dialog-props';
import { AboutDialog } from '../components/dialogs/about-dialog/about-dialog';
import { AboutDialogProps } from '../models/dialogs/about-dialogs-props';
import { RequirementTemplateListDialog } from '../components/dialogs/requirement-template-list-dialog/requirement-template-list-dialog';
import { RequirementTemplateListDialogProps } from '../models/components/requirement-template-list-dialog-props';
import { ChangePasswordDialog } from '../components/dialogs/change-password-dialog/change-password-dialog';
import { ChangePasswordDialogProps } from '../models/dialogs/change-password-dialog-props';
import { EditProfileDialogProps } from '../models/dialogs/edit-profile-dialog-props';
import { EditProfileDialog } from '../components/dialogs/edit-profile-dialog/edit-profile-dialog';
import { SubdivisionMembersDialogProps } from '../models/dialogs/subdivision-members-dialog-props';
import { SubdivisionMembersDialog } from '../components/dialogs/subdivision-members-dialog/subdivision-members-dialog';
import { EditRequirementCategoryDialogProps } from '../models/dialogs/edit-requirement-category-dialog-props';
import { EditRequirementCategoryDialog } from '../components/dialogs/edit-category-dialog/edit-requirement-category-dialog';
import { RequirementCommentDialogProps } from '../models/dialogs/requirement-comment-dialog-props';
import { RequirementCommentDialog } from '../components/dialogs/requirement-comment-dialog/requirement-comment-dialog';
import { NotificationListDialogProps } from '../models/dialogs/notification-list-dialog-props';
import { NotificationListDialog } from '../components/dialogs/notification-list-dialog/notification-list-dialog';
import { FileUploadDialogProps } from '../models/dialogs/file-upload-dialog-props';
import { FileUploadDialog } from '../components/dialogs/file-upload-dialog/file-upload-dialog';
import { FileDialog } from '../components/dialogs/file-dialog/file-dialog';
import { FileDialogProps } from '../models/dialogs/file-dialog-props';
import { toDecapitalize } from '../utils/string-helpers';

type CommonDialogsContextModel = {
  showDialog: (name: string, dialogProps: DialogProps) => void;
};

const CommonDialogsContext = createContext({} as CommonDialogsContextModel);

function CommonDialogsContextProvider(props: any) {
  const [promptDialogProps, setPromptDialogProps] = useState<PromptDialogProps>();
  const [aboutDialogProps, setAboutDialogProps] = useState<AboutDialogProps>();
  const [requirementTemplateListDialogProps, setRequirementTemplateListDialogProps] = useState<RequirementTemplateListDialogProps>();
  const [changePasswordDialogProps, setChangePasswordDialogProps] = useState<ChangePasswordDialogProps>();
  const [editProfileDialogProps, setEditProfileDialogProps] = useState<EditProfileDialogProps>();
  const [editRequirementCategoryDialogProps, setEditRequirementCategoryDialogProps] = useState<EditRequirementCategoryDialogProps>();
  const [subdivisionMembersDialogProps, setSubdivisionMembersDialogProps] = useState<SubdivisionMembersDialogProps>();
  const [requirementCommentDialogProps, setRequirementCommentDialogProps] = useState<RequirementCommentDialogProps>();
  const [notificationListDialogProps, setNotificationListDialogProps] = useState<NotificationListDialogProps>();
  const [fileUploadDialogProps, setFileUploadDialogProps] = useState<FileUploadDialogProps>();
  const [fileDialogProps, setFileDialogProps] = useState<FileDialogProps>();

  const dialogMapper = useMemo(() => {

    return {
      promptDialog: setPromptDialogProps,

      aboutDialog: setAboutDialogProps,

      requirementTemplateListDialog: setRequirementTemplateListDialogProps,

      changePasswordDialog: setChangePasswordDialogProps,

      editProfileDialog: setEditProfileDialogProps,

      subdivisionMembersDialog: setSubdivisionMembersDialogProps,

      editRequirementCategoryDialog: setEditRequirementCategoryDialogProps,

      requirementCommentDialog: setRequirementCommentDialogProps,

      notificationListDialog: setNotificationListDialogProps,

      fileUploadDialog: setFileUploadDialogProps,

      fileDialog: setFileDialogProps
    };
  }, []);

  const showDialog = useCallback((name: string, dialogProps: DialogProps) => {
    const key = toDecapitalize(name);
    (dialogMapper[key] as Dispatch<SetStateAction<DialogProps | undefined>>)(dialogProps);
  }, [dialogMapper]);

  return (
    <CommonDialogsContext.Provider value={{ showDialog }} {...props}>
      {props.children}
      {promptDialogProps?.visible ? <PromptDialog {...promptDialogProps} /> : null}
      {aboutDialogProps?.visible ? <AboutDialog {...aboutDialogProps} /> : null}
      {requirementTemplateListDialogProps?.visible ? <RequirementTemplateListDialog {...requirementTemplateListDialogProps} /> : null}
      {changePasswordDialogProps?.visible ? <ChangePasswordDialog {...changePasswordDialogProps} /> : null}
      {editProfileDialogProps?.visible ? <EditProfileDialog {...editProfileDialogProps} /> : null}
      {editRequirementCategoryDialogProps?.visible ? <EditRequirementCategoryDialog {...editRequirementCategoryDialogProps} /> : null}
      {subdivisionMembersDialogProps?.visible ? <SubdivisionMembersDialog {...subdivisionMembersDialogProps} /> : null}
      {requirementCommentDialogProps?.visible ? <RequirementCommentDialog {...requirementCommentDialogProps} /> : null}
      {notificationListDialogProps?.visible ? <NotificationListDialog {...notificationListDialogProps} /> : null}
      {fileUploadDialogProps?.visible ? <FileUploadDialog {...fileUploadDialogProps} /> : null}
      {fileDialogProps?.visible ? <FileDialog {...fileDialogProps} /> : null}
    </CommonDialogsContext.Provider>
  );
}

const useCommonDialogsContext = () => useContext(CommonDialogsContext);

export { CommonDialogsContextProvider, useCommonDialogsContext };
