import '../login-page/login-page.scss';
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule } from 'devextreme-react/ui/form';
import { useCallback, useRef } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { useNavigate } from 'react-router';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { appConstants } from '../../constants/app-constants';
import { showAlertDialog } from '../../utils/common-dialogs';
import { useAppDataContext } from '../../contexts/app-data-context';
import { CorporateAccountActivatorModel } from '../../models/data/corporate-account-activator-model';

export const CorporateAccountActivatorPage = () => {
  const formData = useRef<CorporateAccountActivatorModel>(
    (process.env.NODE_ENV === 'production' ? {
      email: null
    } : {
      email: 'valdemar.leontev@yandex.ru'
    }) as CorporateAccountActivatorModel);

  const navigate = useNavigate();
  const { getInviteCorporateUserAsync } = useAppDataContext();
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
          const newActivateCorporateAccount = await getInviteCorporateUserAsync(formData.current);

          if (newActivateCorporateAccount != null) {
            showAlertDialog({
              title: appConstants.strings.alert,
              iconColor: appConstants.appearance.baseDarkGrey,
              iconName: 'MailIcon',
              iconSize: appConstants.appearance.superHugeIconSize,
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
  }, [getInviteCorporateUserAsync, navigate]);

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
                <div className={'login-form-header'}>Активация учетной записи</div>
              );
            }}
          />
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
              text={'Активировать'}
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
