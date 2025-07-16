import React, { useState } from 'react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild = false }) => {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(!isOpen)
    });
  }
  
  return (
    <button
      type="button"
      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ children, isOpen, setIsOpen, align = "end" }) => {
  if (!isOpen) return null;
  
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2", 
    end: "right-0"
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 z-10" 
        onClick={() => setIsOpen(false)}
      />
      <div className={`absolute ${alignmentClasses[align]} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20`}>
        <div className="py-1">
          {React.Children.map(children, child =>
            React.cloneElement(child, { setIsOpen })
          )}
        </div>
      </div>
    </>
  );
};

export const DropdownMenuItem = ({ children, onClick, setIsOpen, className = "" }) => {
  const handleClick = () => {
    onClick && onClick();
    setIsOpen && setIsOpen(false);
  };
  
  return (
    <button
      type="button"
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default DropdownMenu;
