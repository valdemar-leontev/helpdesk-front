import './requirement-template-list-page.scss';
import { RequirementTemplateTileView } from './requirement-template-tile-view/requirement-template-tile-view';
import { RequirementTemplateListPageProvider, useRequirementTemplateListPageContext } from './requirement-template-list-page-context';
import { Navbar } from '../../components/navbar/navbar';
import { SpeedDialAction } from 'devextreme-react/ui/speed-dial-action';
import { useCallback } from 'react';
import { useAppDataContext } from '../../contexts/app-data-context';
import { useNavigate } from 'react-router';
import notify from 'devextreme/ui/notify';
import { showConfirmDialog } from '../../utils/common-dialogs';
import { appConstants } from '../../constants/app-constants';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';
import { AuthToolbar } from '../../components/toolbars/auth-toolbar/auth-toolbar';
import { useAppAuthContext } from '../../contexts/app-auth-context';
import { Roles } from '../../models/enums/roles';
import { RequirementTemplateListHeader } from './requirement-template-list-header/requirement-template-list-header';
import { RequirementTemplateListDataGrid } from '../../components/grids/requirement-template-list-data-grid';
import { RequirementTemplateListDataGridModes } from '../../models/enums/requirement-template-list-data-grid-modes';
import { RequirementTemplateListPageModes } from '../../models/enums/requirement-template-list-page-modes';
import { NotificationToolbar } from '../../components/toolbars/notification-toolbar/notification-toolbar';
import { InstructionToolbar } from '../../components/toolbars/instruction-toolbar/instruction-toolbar';

export const RequirementTemplateListPageInternal = () => {
  const { createRequirementTemplateAsync } = useAppDataContext();
  const navigate = useNavigate();
  const { getAuthUser } = useAppAuthContext();
  const { requirementTemplateListPageMode, requirementTemplateList } = useRequirementTemplateListPageContext();

  const onCreateRequirementTemplateAsync = useCallback(async () => {
    showConfirmDialog({
      title: appConstants.strings.creating,
      iconColor: appConstants.appearance.baseDarkGrey,
      iconName: 'RequirementTemplateIcon',
      iconSize: appConstants.appearance.hugeIconSize,
      textRender: () => {
        return (
          <span>Действительно хотите создать новую форму?</span>
        );
      },
      callback: async (dialogResult?: boolean) => {
        if (!dialogResult) {
          return;
        }

        const requirementTemplate = await createRequirementTemplateAsync();
        if (requirementTemplate) {
          navigate(`/requirement-template/${requirementTemplate.id}`, {
            state: requirementTemplate
          });
        }
      }
    });
  }, [createRequirementTemplateAsync, navigate]);

  return (
    <div className={'app-content-card'}>
      <Navbar>
        <div className='navbar__item navbar__search'>
          <AuthToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <NotificationToolbar />
        </div>
        <div className={'navbar__item navbar__search'}>
          <InstructionToolbar />
        </div>
        <div className='navbar__item navbar__search'>
          <CommonToolbar />
        </div>
      </Navbar> {requirementTemplateList
        ? <div className={'app-card'}>
          <RequirementTemplateListHeader />
          {requirementTemplateListPageMode === RequirementTemplateListPageModes.tile
            ? <>
              <RequirementTemplateTileView />
              {getAuthUser()?.roleId === Roles.admin
                ?
                <>
                  <SpeedDialAction icon={'add'} label={appConstants.strings.add} onClick={onCreateRequirementTemplateAsync} />
                  <SpeedDialAction icon={'search'} label={appConstants.strings.search} onClick={() => {
                    notify(appConstants.strings.featureNotAvailable, 'info', 3000);
                  }} />
                </>
                : null}
            </>
            : <RequirementTemplateListDataGrid mode={RequirementTemplateListDataGridModes.page} />
          }
        </div>
        : <>
          <div className={'dx-empty-message'}>{appConstants.strings.noData}</div>
        </>
      }
    </div>
  );
};

export const RequirementTemplatesPage = () => {
  return (
    <RequirementTemplateListPageProvider>
      <RequirementTemplateListPageInternal />
    </RequirementTemplateListPageProvider>
  );
};
