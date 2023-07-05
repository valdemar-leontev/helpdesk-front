import './loader.scss';
import ProgressGear from '../../assets/images/progress-gears.svg';
import { LoadPanel } from 'devextreme-react/ui/load-panel';

export const Loader = () => {
  return (
    <LoadPanel
      wrapperAttr={{ class: 'app-loader' }}
      visible={true}
      position={'center'}
      showPane={true}
      shading={true}
      width={180}
      height={70}
      maxWidth={200}
      maxHeight={70}
      shadingColor={'rgba(0, 0, 0, 0.1)'}
    >
      <img src={ProgressGear} alt={''}/>
      <span>Загрузка...</span>
    </LoadPanel>
  );
};
