import { createContext, useCallback, useContext } from 'react';
import { AppSharedStateDispatcherContextProviderProps } from '../models/contexts/app-shared-state-dispatcher-context-provider-props';
import { AppSharedStateDispatcherContextModel } from '../models/contexts/app-shared-state-dispatcher-context-model';
import { EntityGetRequest } from '../models/abstracts/entity-get-request';
import { useAppSharedContext } from './app-shared-context';
import { useAppDataContext } from './app-data-context';
import { useAppAuthContext } from './app-auth-context';

const AppSharedStateDispatcherContext = createContext<AppSharedStateDispatcherContextModel>({} as AppSharedStateDispatcherContextModel);

// TODO: make all contexts like one another
function AppSharedStateDispatcherContextProvider(props : AppSharedStateDispatcherContextProviderProps) {
  const { setNotificationCount } = useAppSharedContext();
  const { getEntitiesCountAsync } = useAppDataContext();
  const { getAuthUser } = useAppAuthContext();

  const updateNotificationCount = useCallback(async () => {
    const authUser = getAuthUser();
    if (!authUser) {
      return;
    }

    const notificationCount = await getEntitiesCountAsync(
        {
          entityTypeName: 'Notification',
          filter: `RecipientUserId==${authUser.userId} && IsRead==false`
        } as EntityGetRequest);

    setNotificationCount(notificationCount ? notificationCount : 0);

  }, [getAuthUser, getEntitiesCountAsync, setNotificationCount]);

  return (
    <AppSharedStateDispatcherContext.Provider value={
      { updateNotificationCount }
    } {...props}/>
  );
}

const useAppSharedStateDispatcherContext = () => useContext(AppSharedStateDispatcherContext);

export { AppSharedStateDispatcherContextProvider, useAppSharedStateDispatcherContext };
