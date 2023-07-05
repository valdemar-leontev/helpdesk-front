import { Popup } from 'devextreme-react/ui/popup';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { RequirementTemplateListPageProvider } from '../../../pages/requirement-template-list-page/requirement-template-list-page-context';
import { RequirementTemplateList } from './requirement-template-list-dialog-content';
import { PopupTitle } from '../popup-title';

// eslint-disable-next-line no-empty-pattern
export const RequirementTemplateListDialog = ({ }: DialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={'Шаблоны заявок'} dialogName={'RequirementTemplateList'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup requirement-template-list-dialog' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      height={'70vh'}
      maxWidth={'50%'}
      visible={true}
      onHidden={() => {
        showDialog('RequirementTemplateListDialog', { visible: false } as DialogProps);
      }}
    >
      <RequirementTemplateListPageProvider>
        <RequirementTemplateList />
      </RequirementTemplateListPageProvider>

    </Popup>
  );
};
