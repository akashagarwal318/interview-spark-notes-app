import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const FullscreenPortal = ({ children }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }
  useEffect(() => {
    const el = elRef.current;
    document.body.appendChild(el);
    return () => { document.body.removeChild(el); };
  }, []);
  return ReactDOM.createPortal(children, elRef.current);
};

export default FullscreenPortal;
