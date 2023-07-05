import './about-dialog-content.scss';
import { Button } from 'devextreme-react/ui/button';
import { DialogConstants } from '../../../constants/dialog-constants';
import { DialogProps } from '../../../models/dialogs/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialog-context';
import { ReactComponent as HelpdeskFormsImage } from '../../../assets/helpdesk-forms.svg';
import { appConstants } from '../../../constants/app-constants';

export const AboutDialogContent = () => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <>
      <div className={'about-dialog-content'} >
        <div>
          <HelpdeskFormsImage />
        </div>
        <div>
          <div>{appConstants.title} v.{appConstants.version}</div>
          <div>{appConstants.company}</div>
          <div>Все права сохранены.</div>
        </div>
      </div>

      <div className='dialog-content__buttons'>
        <Button
          type={'default'}
          text={DialogConstants.ButtonCaptions.Close}
          onClick={() => showDialog('AboutDialog', { visible: false } as DialogProps)}
        />
      </div>
    </>
  );
};
