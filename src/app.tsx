import './app.scss';
import { useEffect } from 'react';
import messages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages } from 'devextreme/localization';
import { AppSharedContextProvider } from './contexts/app-shared-context';
import { AppSharedStateDispatcherContextProvider } from './contexts/app-shared-state-dispatcher-context';
import { AppDataContextProvider } from './contexts/app-data-context';
import { CommonDialogsContextProvider } from './contexts/common-dialog-context';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app-router';
import { AppAuthContextProvider } from './contexts/app-auth-context';
import dxHtmlEditor from 'devextreme/ui/html_editor';
import dxRadioGroup from 'devextreme/ui/radio_group';
import config from 'devextreme/core/config';

function App() {
  useEffect(() => {
    config({
      floatingActionButtonConfig: {
        position: { at: 'right bottom', my: 'right bottom', offset: '-20' }
      }
    });

    loadMessages(messages);
    locale('ru');

    dxHtmlEditor.defaultOptions({
      options: {
        //
      },
    });

    dxRadioGroup.defaultOptions({
      device: { deviceType: 'desktop' },
      options: {
        //
      },
    });
  }, []);

  return (
    <BrowserRouter>
      <AppAuthContextProvider>
        <AppSharedContextProvider>
          <AppDataContextProvider>
            <AppSharedStateDispatcherContextProvider>
              <CommonDialogsContextProvider>
                <AppRouter />
              </CommonDialogsContextProvider>
            </AppSharedStateDispatcherContextProvider>
          </AppDataContextProvider>
        </AppSharedContextProvider>
      </AppAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
