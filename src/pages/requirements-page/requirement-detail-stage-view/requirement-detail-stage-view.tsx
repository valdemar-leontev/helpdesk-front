import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DataGrid, Column, Scrolling } from 'devextreme-react/ui/data-grid';
import { useAppDataContext } from '../../../contexts/app-data-context';
import { RequirementStageModel } from '../../../models/data/requirement-stage-model';
import { Button } from 'devextreme-react/ui/button';
import { CommentIcon, HistoryIcon } from '../../../components/icons/icons';
import { appConstants } from '../../../constants/app-constants';
import { showAlertDialog } from '../../../utils/common-dialogs';
import { useIconFactories } from '../../../components/icons/use-icon-factories';
import notify from 'devextreme/ui/notify';

const RequirementDetailStageView = ({ requirementId }: { requirementId: number }) => {

  const { getRequirementStageListAsync, getRequirementCommentAsync } = useAppDataContext();
  const [requirementStages, setRequirementStages] = useState<RequirementStageModel[]>([]);
  const dataGridRef = useRef<DataGrid<RequirementStageModel>>(null);
  const { RequirementStateIconFactory } = useIconFactories();

  useEffect(() => {
    (async () => {
      const requirementStageList = await getRequirementStageListAsync(requirementId);
      if (requirementStageList) {
        setRequirementStages(requirementStageList);
      }
    })();
  }, [getRequirementStageListAsync, requirementId]);

  const showRequirementCommentAsync = useCallback(async () => {
    const requirementStageId = dataGridRef.current?.instance.option('focusedRowKey');

    const requirementStage = requirementStages?.find(r => r.id === requirementStageId);

    if ((requirementStage && !requirementStage.withComment)) {
      notify('Комментарий отсутствует.', 'warning', 3000);

      return;
    }

    const requirementComment = await getRequirementCommentAsync(requirementStageId);
    if (requirementComment) {
      showAlertDialog({
        title: 'Комментарий',
        textRender: () => {
          return (
            <>
              <div dangerouslySetInnerHTML={{ __html: requirementComment.description }} />
            </>
          );
        },
      });
    }
  }, [getRequirementCommentAsync, requirementStages]);

  return (
    <>
      <div style={{ display: 'flex', gap: 10, padding: 10, marginBottom: 10 }}>
        <HistoryIcon size={22} />
        <span style={{ fontSize: 14, color: 'black', fontWeight: 500 }}>История изменений</span>
      </div>

      <DataGrid
        ref={dataGridRef}
        className={'app-data-grid'}
        dataSource={requirementStages}
        height={'25vh'}
        focusedRowEnabled={true}
        keyExpr={'id'}
      >
        <Scrolling mode="standard" />

        <Column
          type={'buttons'}
          width={60}
          cellRender={(e) => {
            return (
              e.data.withComment
                ? <Button className={'app-command-button'} onClick={async () => await showRequirementCommentAsync()}>
                  <CommentIcon size={appConstants.appearance.normalIconSize} />
                </Button>
                : null
            );
          }}
        />

        <Column
          cellRender={(e) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <HistoryIcon size={appConstants.appearance.normalIconSize} />
                <span>{e.data.userName}</span>
              </div>
            );
          }}
          dataType='string'
          caption={'Пользователь'} />

        <Column
          dataField='creationDate'
          dataType='datetime'
          caption={'Дата изменения'} />

        <Column
          cellRender={(e) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 60, }}>
                  {RequirementStateIconFactory(e.data.stateId)}
                  {e.data.withComment
                    ? <CommentIcon title={'Комментарий'} size={appConstants.appearance.smallIconSize} />
                    : null}
                </div>

                <span>{e.data.stateName}</span>
              </div>
            );
          }}
          dataField='stateName'
          dataType='string'
          caption={'Состояние'}
        />
      </DataGrid>
    </>
  );
};

export default RequirementDetailStageView;
