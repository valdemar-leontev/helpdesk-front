import { createContext, useContext } from 'react';
import { AppDataContextRequirementTemplateEndpointsModel, useRequirementTemplateData } from './app-data-context/use-requirement-template-data';
import { AppDataContextQuestionEndpointsModel, useQuestionData } from './app-data-context/use-question-data';
import { AppDataContextProfileEndpointsModel, useProfileData } from './app-data-context/use-profile-data';
import { AppDataContextVariantEndpointsModel, useVariantData } from './app-data-context/use-variant-data';
import { AppDataContextRequirementEndpointsModel, useRequirementData } from './app-data-context/use-requirement-data';
import { AppDataContextRegistrationEndpointsModel, useRegistrationData } from './app-data-context/use-registration-data';
import { AppDataContextNotificationEndpointsModel, useNotificationData } from './app-data-context/use-notification-data';
import { AppDataContextOrganizationEndpointsModel, useOrganizationData } from './app-data-context/use-organization-data';
import { AppDataContextEntityEndpointsModel, useEntityData } from './app-data-context/use-entity-data';
import { AppDataContextLoginEndpointsModel, useLoginData } from './app-data-context/use-login-data';
import { AppDataContextFileEndpointsModel, useFileData } from './app-data-context/use-file-data';

export type AppDataContextModel =
    AppDataContextRequirementTemplateEndpointsModel &
    AppDataContextEntityEndpointsModel &
    AppDataContextFileEndpointsModel &
    AppDataContextLoginEndpointsModel &
    AppDataContextNotificationEndpointsModel &
    AppDataContextOrganizationEndpointsModel &
    AppDataContextProfileEndpointsModel &
    AppDataContextQuestionEndpointsModel &
    AppDataContextRegistrationEndpointsModel &
    AppDataContextRequirementEndpointsModel &
    AppDataContextVariantEndpointsModel;

const AppDataContext = createContext<AppDataContextModel>({} as AppDataContextModel);

function AppDataContextProvider(props: any) {
  const requirementTemplateEndpoints = useRequirementTemplateData();

  const questionEndpoints = useQuestionData();

  const profileEndpoints = useProfileData();

  const variantEndpoints = useVariantData();

  const requirementEndpoints = useRequirementData();

  const registrationEndpoints = useRegistrationData();

  const notificationEndpoints = useNotificationData();

  const organizationEndpoints = useOrganizationData();

  const entityEndpoints = useEntityData();

  const loginEndpoints = useLoginData();

  const fileEndpoints = useFileData();

  return (
    <AppDataContext.Provider
      value={{
        ...requirementTemplateEndpoints,
        ...questionEndpoints,
        ...profileEndpoints,
        ...variantEndpoints,
        ...requirementEndpoints,
        ...registrationEndpoints,
        ...notificationEndpoints,
        ...organizationEndpoints,
        ...loginEndpoints,
        ...entityEndpoints,
        ...fileEndpoints
      }}
      {...props}
    />
  );
}

const useAppDataContext = () => useContext(AppDataContext);

export { AppDataContextProvider, useAppDataContext };
