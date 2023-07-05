import { Navigate } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router';
import { HomePage } from './pages/home-page/home-page';
import { RequirementTemplatesPage } from './pages/requirement-template-list-page/requirement-template-list-page';
import { RequirementTemplatePage } from './pages/requirement-template-page/requirement-template-page';
import { RequirementPage } from './pages/requirement-page/requirement-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegistrationPage } from './pages/registration-page/registration-page';
import { useAppAuthContext } from './contexts/app-auth-context';
import { UserRequirementPage } from './pages/requirements-page/requirements-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { NotificationsPage } from './pages/notifications-page/notifications-page';
import { OrganizationTreePage } from './pages/organization-tree-page/organization-tree-page';
import { RequirementCategoriesPage } from './pages/requirement-categories-page/requirement-categories-page';
import { NavigationControl } from './components/navigation-control/navigation-control';
import { FilesPage } from './pages/files-page/files-page';

const Authorized = ({ children, onlyAsAdmin }: { children: JSX.Element, onlyAsAdmin?: boolean }) => {
  const { isAuth, isAdmin } = useAppAuthContext();
  const location = useLocation();

  if (!isAuth() || (onlyAsAdmin && !isAdmin())) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const Anonymous = ({ children }: { children: JSX.Element }) => {
  const { isAuth } = useAppAuthContext();
  const location = useLocation();

  if (isAuth()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const AppRouter = () => {
  const { isAdmin } = useAppAuthContext();

  return (
    <div id={'contextMenu'}>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path='/requirement-templates' element={
          <Authorized onlyAsAdmin>
            <RequirementTemplatesPage />
          </Authorized>} />

        {isAdmin() ? <Route path='/requirement-template/:requirementTemplateId' element={
          <Authorized onlyAsAdmin>
            <RequirementTemplatePage />
          </Authorized>
        } /> : null}

        <Route path='/requirement/:requirementTemplateId' element={
          <Authorized>
            <RequirementPage />
          </Authorized>} />

        <Route path='/requirement/:requirementTemplateId/:requirementId' element={
          <Authorized>
            <RequirementPage />
          </Authorized>} />

        <Route path='/requirements' element={
          <Authorized>
            <UserRequirementPage />
          </Authorized>} />

        <Route path='/notifications' element={
          <Authorized>
            <NotificationsPage />
          </Authorized>} />

        <Route path='/profile' element={
          <Authorized>
            <ProfilePage />
          </Authorized>} />

        <Route path='/organization-tree' element={
          <Authorized onlyAsAdmin>
            <OrganizationTreePage />
          </Authorized>} />

        <Route path='/requirement-categories' element={
          <Authorized onlyAsAdmin>
            <RequirementCategoriesPage />
          </Authorized>} />

        <Route path='/files' element={
          <Authorized>
            <FilesPage />
          </Authorized>} />

        <Route path='/login' element={
          <Anonymous>
            <LoginPage />
          </Anonymous>} />

        <Route path='/registration' element={
          <Anonymous>
            <RegistrationPage />
          </Anonymous>} />

        <Route path='/not-found' element={<NotFoundPage />} />

        <Route path='*' element={<Navigate to='/not-found' replace />} />
      </Routes>

      <NavigationControl />
    </div>
  );
};
