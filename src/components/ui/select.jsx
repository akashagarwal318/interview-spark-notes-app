import React, { useState, useRef, useEffect } from 'react';

export const Select = ({ children, value, onValueChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const rootRef = useRef(null);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const onDocKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onDocKey);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onDocKey);
    };
  }, []);

  // keep internal selectedValue in sync when parent updates value
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="relative" ref={rootRef}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          setIsOpen, 
          selectedValue, 
          handleSelect, 
          disabled 
        })
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className, isOpen, setIsOpen, disabled }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    onClick={() => !disabled && setIsOpen(!isOpen)}
    disabled={disabled}
  >
    {children}
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 opacity-50"
    >
      <path
        d="m4.93179 5.43179c-.20811-.20811-.20811-.54544 0-.75355c.20811-.20811.54544-.20811.75355 0l2.31466 2.31466l2.31466-2.31466c.2081-.20811.5454-.20811.7535 0c.2081.20811.2081.54544 0 .75355l-2.6924 2.69237c-.2081.2081-.5454.2081-.7535 0z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

export const SelectValue = ({ placeholder, selectedValue, children }) => (
  <span>{selectedValue || placeholder || children}</span>
);

export const SelectContent = ({ children, isOpen, handleSelect }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
      <div className="max-h-60 overflow-auto p-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { handleSelect })
        )}
      </div>
    </div>
  );
};

export const SelectItem = ({ children, value, handleSelect }) => (
  <div
    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
    onClick={() => handleSelect(value)}
  >
    {children}
  </div>
);

export default Select;
