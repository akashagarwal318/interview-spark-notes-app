
import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10"
        >
          ×
        </button>
        <img
          src={imageSrc}
          alt="Full size"
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageModal;
