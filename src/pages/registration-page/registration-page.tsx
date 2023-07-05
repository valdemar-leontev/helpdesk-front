import '../login-page/login-page.scss';
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule, CustomRule, StringLengthRule } from 'devextreme-react/ui/form';
import { useCallback, useRef, useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { useNavigate } from 'react-router';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { appConstants } from '../../constants/app-constants';
import { UserRegistrationModel } from '../../models/data/user-registration-model';
import { showAlertDialog } from '../../utils/common-dialogs';
import { useAppDataContext } from '../../contexts/app-data-context';

export const RegistrationPage = () => {
  const formData = useRef<UserRegistrationModel>(
    (process.env.NODE_ENV === 'production' ? {
      name: null,
      email: null,
      password: null,
      confirmedPassword: null
    } : {
      name: 'Vladimir',
      email: 'valdemar.leontev@yandex.com',
      password: 't5@47#1d',
      confirmedPassword: 't5@47#1d'
    }) as UserRegistrationModel);

  const navigate = useNavigate();
  const { getInviteAsync } = useAppDataContext();
  const [isPasswordMode, setIsPasswordMode] = useState<boolean>(true);
  const formRef = useRef<Form>(null);

  const onRegisterAsync = useCallback(async () => {
    if (formData && formData.current) {
      const validationGroupResult = formRef.current?.instance.validate();
      if (validationGroupResult && !validationGroupResult.isValid) {
        const brokenRule = validationGroupResult.brokenRules?.find(() => true);
        if (brokenRule) {
          (brokenRule as any).validator.focus();
        }
      } else {
        {
          const newUserRegistration = await getInviteAsync(formData.current);

          if (newUserRegistration != null) {
            showAlertDialog({
              title: appConstants.strings.alert,
              iconColor: appConstants.appearance.baseDarkGrey,
              iconName: 'MailIcon',
              iconSize: appConstants.appearance.hugeIconSize,
              textRender: () => {
                return (
                  <>
                    <span>На почту</span>
                    <a style={{ fontWeight: 'bolder', margin: '0 5px' }} href={`mailto:${formData.current.email}`}>{formData.current.email}</a>
                    <span>была выслана ссылка для подтверждения регистрации.</span>
                  </>
                );
              },
              callback: () => {
                navigate('/');
              }
            });
          }
        }
      }
    }
  }, [getInviteAsync, navigate]);

  return (
    <div className={'login-page'} >
      <Navbar>
        <div className='navbar__item navbar__search'>
          <CommonToolbar />
        </div>
      </Navbar>
      <div className={'login-form-container'}>
        <Form ref={formRef} className={'card login-form'} formData={formData.current}>
          <Item
            render={() => {
              return (
                <div className={'login-form-header'}>Создать новый аккаунт</div>
              );
            }}
          />
          <Item
            dataField={'name'}
            editorType={'dxTextBox'}
            editorOptions={{
              stylingMode: 'underlined',
              placeholder: appConstants.strings.userName,
              mode: 'text',
            }}
          >
            <RequiredRule message={appConstants.strings.userNameRequired} />
            <Label visible={false} />
          </Item>
          <Item
            dataField={'email'}
            editorType={'dxTextBox'}
            editorOptions={{
              stylingMode: 'underlined',
              placeholder: appConstants.strings.userEmail,
              mode: 'text'
            }}
          >
            <RequiredRule message={appConstants.strings.userEmailRequired} />
            <EmailRule />
            <Label visible={false} />
          </Item>
          <Item
            dataField={'password'}
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
                const data = formData.current as UserRegistrationModel;

                return data.password && data.confirmedPassword && data.password === data.confirmedPassword;
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
                const data = formData.current as UserRegistrationModel;

                return data.password && data.confirmedPassword && data.password === data.confirmedPassword;
              }
              } />
            <Label visible={false} />
          </Item>
          <Item render={() => {
            return (
              <div className={'login-form-changer'}>
                <span>Уже есть аккаунт?</span>
                <span onClick={() => navigate('/login')}>Войти</span>
              </div>
            );
          }} />
          <ButtonItem>
            <ButtonOptions
              width={'100%'}
              type={'default'}
              useSubmitBehavior={true}
              text={appConstants.strings.create}
              onClick={async () => {
                await onRegisterAsync();
              }}
            >
            </ButtonOptions>
          </ButtonItem>
        </Form>
      </div>
    </div>
  );
};