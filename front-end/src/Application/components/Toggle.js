import { useState, useEffect } from 'react';
import Humberger from './Humberger';
import Nav from './Nav';

const Toggle = () => {
  const [visible, setvisible] = useState(false);

  const visibility = () => {
    setvisible(!visible);
  };

  const closeNav = () => {
    setvisible(false);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile &&  <Humberger onClick={visibility}  isnavvisible={visible}/>}
      {visible && <Nav onClose={closeNav} />} 
      {!isMobile && <Nav  />} 
    
    </>
  );
};

export default Toggle;