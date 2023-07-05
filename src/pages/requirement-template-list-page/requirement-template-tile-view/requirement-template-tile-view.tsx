import './requirement-template-tile-view.scss';
import { RequirementTemplateModel } from '../../../models/data/requirement-templates-model';
import { RequirementTemplateTileItem } from './requirement-template-tile-item/requirement-template-tile-item';
import { TileView } from 'devextreme-react/ui/tile-view';
import { useRef } from 'react';
import { useRequirementTemplateListPageContext } from '../requirement-template-list-page-context';
import { appConstants } from '../../../constants/app-constants';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'devextreme-react/ui/button';
import { ContextMenu } from 'devextreme-react/ui/context-menu';
import { MenuItemModel } from '../../../models/components/menu-item-model';
import { ExtensionVertIcon } from '../../../components/icons/icons';
import { MainContextMenu } from '../../../components/menu/main-context-menu/main-context-menu';
import { useRequirementTemplateTileItemContextMenuItems } from './requirement-template-tile-item/use-requirement-template-tile-item-context-menu-items';

export const RequirementTemplateTileView = () => {
  const { currentRequirementTemplateListItemRef } = useRequirementTemplateListPageContext();
  const rowContextMenuRef = useRef<ContextMenu<MenuItemModel>>(null);
  const contextMenuItems = useRequirementTemplateTileItemContextMenuItems();
  const { requirementTemplateList } = useRequirementTemplateListPageContext();

  const isMobileScreen = useMediaQuery({
    query: '(max-width: 425px)'
  });

  return (
    <>
      <TileView
        className={'questionnaire-tile-view'}
        items={requirementTemplateList}
        noDataText={undefined}
        itemRender={(requirementTemplate: RequirementTemplateModel) => {
          return (
            <RequirementTemplateTileItem requirementTemplate={requirementTemplate}>
              <Button className={'app-command-button'} onClick={async e => {
                if (rowContextMenuRef && rowContextMenuRef.current) {
                  currentRequirementTemplateListItemRef!.current = requirementTemplate;
                  rowContextMenuRef.current.instance.option('target', e.element);
                  await rowContextMenuRef.current.instance.show();
                }
              }} >
                <ExtensionVertIcon size={appConstants.appearance.normalIconSize} />
              </Button>
            </RequirementTemplateTileItem>
          );
        }}
        direction={isMobileScreen ? 'vertical' : 'horizontal'}
        baseItemHeight={isMobileScreen ? 150 : 200}
        baseItemWidth={isMobileScreen ? 350 : 200}
        height={isMobileScreen ? '100%' : 250}
        width='100%'
      />

      <MainContextMenu ref={rowContextMenuRef} items={contextMenuItems} />
    </>
  );
};
