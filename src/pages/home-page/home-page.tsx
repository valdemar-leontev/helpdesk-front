import './home-page.scss';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/navbar/navbar';
import { Button } from 'devextreme-react/ui/button';
import { useLocation, useNavigate } from 'react-router';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { useEffect } from 'react';
import notify from 'devextreme/ui/notify';
import { appConstants } from '../../constants/app-constants';
import { HomePageLocationStateModel } from '../../models/pages/home-page-location-state-model';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuth, isUser } = useAppAuthContext();
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      if ((state as HomePageLocationStateModel).redirectFromSignIn) {
        notify(appConstants.strings.signInCompleted, 'success', 3000);
      }

      if ((state as HomePageLocationStateModel).redirectFromSignOut) {
        notify(appConstants.strings.signOutCompleted, 'success', 3000);
      }

      window.history.replaceState({}, document.title);
    }

  }, [state]);

  return (

    <div className={'home-page'}>
      <Navbar>
        <div className={'navbar__item navbar__search'}>
          <AuthToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <NotificationToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <InstructionToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <CommonToolbar />
        </div>
      </Navbar>
      <div
        className={'home-page-banner'}>
        <motion.div className={'home-page-banner-titles'}>
          <motion.p
            animate={{ opacity: [0, 1], scale: [2, 1] }}
            transition={{ ease: 'easeOut', duration: 1 }}
            className={'home-page-banner-titles-p'}
          >HELPDESK
          </motion.p>
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ ease: 'easeOut', duration: 1, delay: 1 }}
          >
            {isUser() ?
              <Button
                className={'home-page-button'}
                text={appConstants.strings.requirements}
                type={'default'}
                onClick={() => {
                  navigate('/requirements');
                }}
              />
              : <Button
                className={'home-page-button'}
                text={isAuth() ? appConstants.strings.constructor : appConstants.strings.signIn}
                type={'default'}
                onClick={() => {
                  navigate(isAuth() ? '/requirement-templates' : '/login');
                }}
              />}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
