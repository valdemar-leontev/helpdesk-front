import './not-found-page.scss';
import { Navbar } from '../../components/navbar/navbar';
import { NotFoundSvg } from '../../assets/images/not-found-svg';
import { CommonToolbar } from '../../components/toolbars/common-toolbar/common-toolbar';

export const NotFoundPage = () => {
  return (
    <>
      <Navbar>
        <div className='navbar__item navbar__search'>
          <CommonToolbar />
        </div>
      </Navbar>
      <div className='not-found-container'>
        <NotFoundSvg />
        <div className='not-found-texts'>
          <span>СТРАНИЦА, КОТОРУЮ ВЫ ИСКАЛИ, НЕ СУЩЕСТВУЕТ.</span>
          <p>ВОЗМОЖНО, ВЫ ОШИБЛИСЬ В АДРЕСЕ ИЛИ СТРАНИЦА МОГЛА ПЕРЕМЕСТИТЬСЯ.</p>
        </div>
      </div>
    </>
  );
};
