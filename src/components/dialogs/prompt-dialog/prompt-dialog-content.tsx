import { useCallback, useRef, useState } from 'react';
import { Button } from 'devextreme-react/ui/button';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { PromptDialogCallback } from '../../../models/dialogs/prompt-dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { PromptModel } from '../../../models/data/prompt-model';
import { DialogConstants } from '../../../constants/dialog-constants';

export const PromptDialogContent = ({ initialValue, callback }: {initialValue?: string, callback: PromptDialogCallback}) => {
  const { showDialog } = useCommonDialogsContext();
  const formRef = useRef<Form>(null);

  const [prompt] = useState( {
    value: null
  } as PromptModel);

  const onButtonOkClickAsync = useCallback(async () => {
    const formData = formRef.current?.instance.option('formData');
    const validationGroupResult = formRef.current?.instance.validate();

    if (validationGroupResult && validationGroupResult.brokenRules && !validationGroupResult.isValid) {
      if (validationGroupResult.brokenRules.find(() => true)) {
        validationGroupResult.validators?.find(() => true).focus();
      }

      return;
    }
    
    const prompt = formData as PromptModel;
    if (prompt.value) {
      callback(prompt.value);
    }
    showDialog('PromptDialog', { visible: false } as DialogProps);
  }, [callback, showDialog]);

  return (
    <>
      <Form
        ref={formRef}
        formData={prompt}>

        <SimpleItem
          dataField={'value'}
          isRequired={true}
          label={{ visible: false }}
          editorType={'dxTextBox'}
          editorOptions={
            {
              stylingMode:'underlined',
              value: initialValue
            }
          }
        />
      </Form>

      <div className='dialog-content__buttons'>
        <Button
          className='dialog-content__button'
          type={'default'}
          text={DialogConstants.ButtonCaptions.Ok}
          onClick={async () => {
            await onButtonOkClickAsync();
          }}
        />
        <Button
          className='dialog-content__button'
          type={'normal'}
          text={DialogConstants.ButtonCaptions.Cancel}
          onClick={() => showDialog('PromptDialog', { visible: false } as DialogProps)}
        />
      </div>
    </>
  );
};
