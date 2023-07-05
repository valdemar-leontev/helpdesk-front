import { createContext, useContext, useState } from 'react';
import { AppSharedContextModel } from '../models/contexts/app-shared-context-model';
import { Loader } from '../components/loader/loader';

const AppSharedContext = createContext({} as AppSharedContextModel);

function AppSharedContextProvider(props: any) {
  const [isShowLoadPanel, setIsShowLoadPanel] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  return (
    <AppSharedContext.Provider value={{ isShowLoadPanel, setIsShowLoadPanel, notificationCount, setNotificationCount }} {...props}>
      {props.children}
      {isShowLoadPanel ? <Loader /> : null}
    </AppSharedContext.Provider>
  );
}

const useAppSharedContext = () => useContext(AppSharedContext);

export { AppSharedContextProvider, useAppSharedContext };
