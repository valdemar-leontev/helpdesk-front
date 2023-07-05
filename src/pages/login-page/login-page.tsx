import './login-page.scss';
import Form, {
  SimpleItem,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule,
} from 'devextreme-react/ui/form';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { useNavigate } from 'react-router';
import { LoginModel } from '../../models/data/login-model';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import notify from 'devextreme/ui/notify';
import { appConstants } from '../../constants/app-constants';
import { useSearchParams } from 'react-router-dom';
import { useAppSharedContext } from '../../contexts/app-shared-context';
import { useAppDataContext } from '../../contexts/app-data-context';

export const LoginPage = () => {
  const formRef = useRef<Form>(null);
  const navigate = useNavigate();
  const { signIn, isAuth } = useAppAuthContext();
  const [isPasswordMode, setIsPasswordMode] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const { getConfirmAsync, getConfirmCorporateUserAsync, getLoginAsync } = useAppDataContext();
  const { setIsShowLoadPanel } = useAppSharedContext();

  const formData = useRef<LoginModel>(
    (process.env.NODE_ENV === 'production' ? {
      email: null,
      password: null,
      rememberMe: true
    } : {
      email: 'leonetx@yandex.ru',
      password: '12345',
      rememberMe: true
    }) as LoginModel);

  const onLoginAsync = useCallback(async () => {
    const validationGroupResult = formRef.current?.instance.validate();
    if (validationGroupResult && !validationGroupResult.isValid) {
      const brokenRule = validationGroupResult.brokenRules?.find(() => true);
      if (brokenRule) {
        (brokenRule as any).validator.focus();
      }
    } else {
      const login = formData.current;
      if (login) {
        const authUser = await getLoginAsync({ ...login, isInternal: false });
        if (authUser !== null) {
          signIn(authUser, login.rememberMe);
          navigate('/', { state: { redirectFromSignIn: true } });
        } else {
          notify(appConstants.strings.authorizationDenied, 'error', 5000);
        }
      }
    }
  }, [getLoginAsync, signIn, navigate]);

  useEffect(() => {
    setIsShowLoadPanel(true);
    setTimeout(() => {
      (async () => {

        if (!isAuth()) {
          const redirectUrlEncoded = searchParams.get('registrationConfirmResponse');
          if (redirectUrlEncoded) {
            const redirectUrlDecoded = window.atob(redirectUrlEncoded);
            const authUser = await getConfirmAsync(redirectUrlDecoded);

            formData.current.email = authUser!.email;

            if (authUser) {
              signIn(authUser, true);
              navigate('/');
            }
          }

          const redirectCorporateUrlEncoded = searchParams.get('corporateUserConfirmResponse');
          if (redirectCorporateUrlEncoded) {
            const redirectCorporateUrlDecoded = window.atob(redirectCorporateUrlEncoded);
            const authUser = await getConfirmCorporateUserAsync(redirectCorporateUrlDecoded);

            if (authUser) {
              signIn(authUser, true);
              navigate('/');
            }
          }

          if (searchParams.has('internal')) {
            const login = {
              isInternal: true,
              email: 'helpdesk@helpdesk.ru',
              password: '00000000000000000000000000000000000000000000000000000000'
            } as LoginModel;

            const adAuthUser = await getLoginAsync(login);
            if (adAuthUser) {
              signIn(adAuthUser, true);
              navigate('/');
            } else {
              notify('Аутентификация не удалась, пользователь был не найден', 'error', 5000);
            }
          }
        }
        setIsShowLoadPanel(false);
      })();

    }, 1000);
  }, [getConfirmAsync, getConfirmCorporateUserAsync, getLoginAsync, isAuth, navigate, searchParams, setIsShowLoadPanel, signIn]);

  return (
    <div className={'login-page'}>
      <Navbar>
        <div className='navbar__item navbar__search'>
          <CommonToolbar />
        </div>
      </Navbar>

      <div className={'login-form-container'}>
        <Form
          ref={formRef}
          className={'card login-form'}
          formData={formData.current}
        >
          <SimpleItem
            render={() => {
              return (
                <div className={'login-form-header'}>Войти в свой аккаунт</div>
              );
            }}
          />
          <SimpleItem
            dataField={'email'}
            editorType={'dxTextBox'}
            editorOptions={{
              disabled: !!searchParams.get('registrationConfirmResponse'),
              stylingMode: 'underlined',
              placeholder: appConstants.strings.userEmail,
              mode: 'email'
            }}
          >
            <RequiredRule message={appConstants.strings.userEmailRequired} />
            <EmailRule />
            <Label visible={false} />
          </SimpleItem>
          <SimpleItem
            dataField={'password'}
            editorOptions={{
              disabled: !!searchParams.get('registrationConfirmResponse'),
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
            <Label visible={false} />
          </SimpleItem>

          <SimpleItem
            dataField={'rememberMe'}
            editorType={'dxCheckBox'}
            editorOptions={{
              disabled: !!searchParams.get('registrationConfirmResponse'),
              text: appConstants.strings.rememberMe,
              elementAttr: { class: 'form-text' },
            }}
          >
            <Label visible={false} />
          </SimpleItem>
          <SimpleItem
            visible={false}
            render={() => {
              return (
                <div className={'login-form-changer'}>
                  <span onClick={() => navigate('/activate-corporate-account')}>
                    Активировать корпоративную учетную запись
                  </span>
                </div>
              );
            }}
          />
          <ButtonItem>
            <ButtonOptions
              disabled={!!searchParams.get('registrationConfirmResponse')}
              width={'100%'}
              type={'default'}
              text={appConstants.strings.signIn}
              onClick={onLoginAsync}
            ></ButtonOptions>
          </ButtonItem>
        </Form>
      </div>
    </div >
  );
};
