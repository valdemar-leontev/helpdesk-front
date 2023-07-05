import { createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import { alert, confirm } from 'devextreme/ui/dialog';
import * as AppIcons from '../components/icons/icons';
import { SimpleDialogContentModel, SimpleDialogModel } from '../models/dialogs/simple-dialog-model';

const dialogContentRender = ({ iconName, iconSize, iconColor, textRender }: SimpleDialogContentModel) => {
  return ReactDOMServer.renderToString(
    createElement(
      () =>
        <div className={'app-common-dialog'}>
          {iconName
            ? createElement((AppIcons as any)[iconName], {
              size: iconSize ? iconSize : 36,
              style: { color: iconColor ? iconColor : '#ff5722', marginLeft: 10, width: 50 }
            })
            : null
          }
          <span>{textRender()}</span>
        </div>,
      {}
    )
  );
};

const showConfirmDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
  confirm(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
    if (callback) {
      callback(dialogResult);
    }
  });
};

const showAlertDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
  alert(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then(() => {
    if (callback) {
      callback();
    }
  });
};

export { showConfirmDialog, showAlertDialog };
