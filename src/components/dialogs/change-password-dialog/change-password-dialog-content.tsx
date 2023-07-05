import './change-password-dialog.scss';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { appConstants } from '../../../constants/app-constants';
import { PasswordIcon } from '../../icons/icons';
import Form, { ButtonItem, ButtonOptions, CustomRule, Item, Label, RequiredRule, StringLengthRule } from 'devextreme-react/ui/form';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { useCallback, useRef, useState } from 'react';
import { ChangePasswordModel } from '../../../models/data/change-password-model';
import { showConfirmDialog } from '../../../utils/common-dialogs';
import notify from 'devextreme/ui/notify';

export const ChangePasswordDialogContent = () => {
  const { showDialog } = useCommonDialogsContext();
  const [isOldPasswordMode, setIsOldPasswordMode] = useState<boolean>(true);
  const [isPasswordMode, setIsPasswordMode] = useState<boolean>(true);
  const { postChangePasswordAsync } = useAppDataContext();
  const formData = useRef<ChangePasswordModel>({
    oldPassword: null,
    newPassword: null,
    confirmedPassword: null,
  } as ChangePasswordModel);
  const formRef = useRef<Form>(null);

  const onChangePasswordAsync = useCallback(async () => {
    if (formData && formData.current) {
      const validationGroupResult = formRef.current?.instance.validate();
      if (validationGroupResult && !validationGroupResult.isValid) {
        const brokenRule = validationGroupResult.brokenRules?.find(() => true);
        if (brokenRule) {
          (brokenRule as any).validator.focus();
        }
      } else {
        {
          if (formData && formData.current.newPassword === formData.current.confirmedPassword) {
            showConfirmDialog({
              title: appConstants.strings.confirm,
              iconColor: appConstants.appearance.baseDarkGrey,
              iconName: 'QuestionIcon',
              iconSize: appConstants.appearance.hugeIconSize,
              textRender: () => {
                return (
                  <span>Вы уверены, что хотите изменить ваш пароль?</span>
                );
              },
              callback: async (dialogResult?: boolean) => {
                if (!dialogResult) {
                  return;
                }

                const updatedUser = await postChangePasswordAsync(formData.current);
                if (updatedUser !== null) {
                  showDialog('ChangePasswordDialog', { visible: false } as DialogProps);

                  notify('Пароль был успешно изменен!', 'success', 3000);
                }
              }
            });
          }
        }
      }
    }
  }, [postChangePasswordAsync, showDialog]);

  return (
    <div className={'change-password-dialog'}>
      <div className={'change-password-dialog-titles'}>
        <PasswordIcon size={50} />
        <span>{appConstants.strings.password}</span>
        <p>Последнее обновление Август 28, 2022</p>
      </div>

      <span className={'change-password-dialog-text'}>Измените ваш пароль</span>

      <Form
        ref={formRef}
        formData={formData.current}
        className={'change-password-dialog-form'}
      >
        <Item
          dataField={'oldPassword'}
          editorType={'dxTextBox'}
          label={{ visible: false }}
          editorOptions={{
            stylingMode: 'underlined',
            placeholder: 'Введите пароль',
            mode: isOldPasswordMode ? 'password' : 'text',
            buttons: [{
              name: 'password',
              location: 'after',
              options: {
                icon: isOldPasswordMode ? 'unlock' : 'lock',
                type: 'default',
                onClick: () => {
                  setIsOldPasswordMode(prevState => !prevState);
                }
              }
            }]
          }}
        >
          <RequiredRule message={appConstants.strings.passwordRequired} />
          <StringLengthRule message={'Пароль должен содержать минимум 6 символов'} min={5} />
        </Item>

        <Item
          dataField={'newPassword'}
          editorOptions={{
            placeholder: appConstants.strings.password,
            stylingMode: 'underlined',
            mode: isPasswordMode ? 'password' : 'text',
            buttons: [{
              name: 'password',
              location: 'after',
              options: {
                icon: isPasswordMode ? 'unlock' : 'lock',
                type: 'default',
                onClick: () => {
                  setIsPasswordMode(prevState => !prevState);
                }
              }
            }]
          }}
        >
          <RequiredRule message={appConstants.strings.passwordRequired} />
          <StringLengthRule message={'Пароль должен содержать минимум 6 символов'} min={6} />
          <CustomRule
            reevaluate
            message={'Пароль и его подтверждение должны совпадать'}
            validationCallback={() => {
              const data = formData.current as ChangePasswordModel;

              return data.newPassword && data.confirmedPassword && data.newPassword === data.confirmedPassword;
            }
            } />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'confirmedPassword'}
          editorOptions={{
            placeholder: appConstants.strings.password,
            stylingMode: 'underlined',
            mode: isPasswordMode ? 'password' : 'text',
            buttons: [{
              name: 'password',
              location: 'after',
              options: {
                icon: isPasswordMode ? 'unlock' : 'lock',
                type: 'default',
                onClick: () => {
                  setIsPasswordMode(prevState => !prevState);
                }
              }
            }]
          }}
        >
          <RequiredRule message={appConstants.strings.passwordRequired} />
          <StringLengthRule message={'Пароль должен содержать минимум 6 символов'} min={6} />
          <CustomRule
            reevaluate
            message={'Пароль и его подтверждение должны совпадать'}
            validationCallback={() => {
              const data = formData.current as ChangePasswordModel;

              return data.newPassword && data.confirmedPassword && data.newPassword === data.confirmedPassword;
            }
            } />
          <Label visible={false} />
        </Item>

        <ButtonItem>
          <ButtonOptions
            useSubmitBehavior={true}
            type={'default'}
            text={appConstants.strings.save}
            onClick={async () => {
              await onChangePasswordAsync();
            }}
          >
          </ButtonOptions>
        </ButtonItem>
      </Form>

      {/* className: 'dialog-content__buttons' */}

    </div>
  );
};
