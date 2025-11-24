import { useRef, useEffect } from 'react';
import '../Css/humberger.css';


const Hum = ({ onClick, isnavvisible }) => {
  const element = useRef(null);
  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);
  const hasrun = useRef(false);

useEffect(() => {
  if (hasrun.current) return;
  hasrun.current = true;
  const handle_animation = () => {
    if (element.current) {
      if (isnavvisible) {
        element.current.classList.add('active');
        line2.current.style.display = 'none';
        line1.current.style.transform = 'rotate(45deg)';
        line3.current.style.transform = 'rotate(-45deg)';
        line3.current.style.marginTop = '-70%';
        element.current.style.position = 'fixed';
      } else {
        element.current.classList.remove('active');
        line1.current.style.transform = 'rotate(0deg)';
        line1.current.style.marginTop = '0';
        line2.current.style.display = 'flex';
        line3.current.style.transform = 'rotate(0deg)';
        line3.current.style.marginTop = '0';
        element.current.style.position = 'absolute';
      }
    }
  };

  handle_animation();
}, [isnavvisible]);

  const handleclick = () => {
    if (onClick) {
      onClick(); 
    }
  };

  return (
    <div className="humberger" ref={element} onClick={handleclick}>
      <div className="humberger__line line1" ref={line1} ></div>
      <div className="humberger__line line2" ref={line2} ></div>
      <div className="humberger__line  line3" ref={line3} ></div>
    </div>
  );
};

export default Hum;