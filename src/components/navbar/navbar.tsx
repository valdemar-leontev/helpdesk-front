import './navbar.scss';
import { ReactComponent as HelpdeskFormsImage } from '../../assets/helpdesk-forms.svg';
import { ReactComponent as HelpdeskLogoImage } from '../../assets/helpdesk-logo.svg';
import { motion } from 'framer-motion';
import { NavbarProps } from '../../models/components/navbar-props';

export const Navbar = ({ children }: NavbarProps) => {

  return (
    <motion.div
      animate={{ y: [-100, 0] }}
      transition={{ ease: 'easeOut', duration: 0.5 }}
      className='navbar'>

      <a className='navbar__item navbar__logo' href='/'>
        <HelpdeskFormsImage />
        <HelpdeskLogoImage />
      </a>

      <div className='navbar__item navbar__empty'></div>

      {children}

    </motion.div>
  );
};
