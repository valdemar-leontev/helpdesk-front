
import { Popup } from 'devextreme-react/ui/popup';
import { PromptDialogContent } from './prompt-dialog-content';
import { PromptDialogProps } from '../../../models/dialogs/prompt-dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { appConstants } from '../../../constants/app-constants';
import { PopupTitle } from '../popup-title';

export const PromptDialog = ({ title, initialValue, callback }: PromptDialogProps) => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup
      titleRender={() => {
        return (
          <PopupTitle text={!title ? appConstants.strings.input : title} dialogName={'Prompt'} />
        );
      }}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={false}
      showCloseButton={true}
      showTitle={true}
      maxWidth={500}
      minWidth={300}
      height={'auto'}
      visible={true}
      onHidden={() => {
        showDialog('PromptDialog', { visible: false } as PromptDialogProps);
      }}
    >
      <PromptDialogContent callback={callback} initialValue={initialValue} />
    </Popup>
  );
};
