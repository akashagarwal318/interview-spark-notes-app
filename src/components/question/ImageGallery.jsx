
import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

const ImageGallery = ({
  question,
  isEditing,
  onImageClick,
  onRemoveImage,
  onAddImage
}) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddImage({
            name: file.name,
            data: event.target.result,
            size: file.size
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        📷 Images
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="ml-2 p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
            title="Add Image"
          >
            <Plus size={14} />
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.svg,.bmp,.tiff"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {question.images && question.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {question.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.data}
                alt={image.name}
                className="w-full h-24 sm:h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 dark:border-gray-700"
                onClick={() => onImageClick(image.data)}
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="truncate">{image.name}</div>
                <div>{(image.size / 1024).toFixed(1)}KB</div>
              </div>
              {isEditing && (
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          {isEditing ? (
            <div>
              <div className="text-4xl mb-2">📷</div>
              <div>No images added yet.</div>
              <div className="text-xs mt-1">Click the + button above to add images</div>
              <div className="text-xs text-gray-400 mt-1">Supports: PNG, JPG, JPEG, GIF, WebP, SVG, BMP, TIFF</div>
            </div>
          ) : (
            "No images added yet."
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
