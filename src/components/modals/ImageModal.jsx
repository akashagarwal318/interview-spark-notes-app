
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setImageModal } from '../../store/slices/uiSlice';

const ImageModal = () => {
  const dispatch = useDispatch();
  const { imageModal } = useSelector((state) => state.ui);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState(true); // fit (contain) vs original (scroll)
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);

  const showImage = !!imageModal?.imageSrc;

  const handleClose = () => {
    dispatch(setImageModal({ isOpen: false, imageSrc: '' }));
  };

  // Reset state when a new image opens
  useEffect(() => {
    if (imageModal.isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setFitMode(true);
    }
  }, [imageModal.isOpen, imageModal.imageSrc]);

  const clampScale = (s) => Math.min(5, Math.max(0.2, s));

  const handleWheel = useCallback((e) => {
    if (!fitMode) return; // allow normal scroll in original mode
    const zoomGesture = e.ctrlKey || e.metaKey;
    if (zoomGesture) {
      e.preventDefault();
      const rect = imgContainerRef.current?.getBoundingClientRect();
      const cursorX = e.clientX - (rect?.left || 0);
      const cursorY = e.clientY - (rect?.top || 0);
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      setScale(prev => {
        const next = clampScale(prev + delta);
        const factor = next / prev - 1;
        setPosition(p => ({ x: p.x - cursorX * factor, y: p.y - cursorY * factor }));
        return next;
      });
    } else if (scale > 1) {
      //vetical scroll
      e.preventDefault();
      // vertical pan with wheel when zoomed
      setPosition(p => ({ ...p, y: p.y - e.deltaY * 0.5 }));
    }
  }, [fitMode, scale]);

  const startPan = (e) => {
    if (!fitMode || scale === 1) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onPan = (e) => {
    if (!isPanning) return;
    setPosition({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };

  const endPan = () => setIsPanning(false);

  const zoomIn = () => setScale(s => clampScale(s + 0.25));
  const zoomOut = () => setScale(s => clampScale(s - 0.25));
  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };
  const toggleFitMode = () => { setFitMode(f => !f); resetView(); };

  if (!imageModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" role="dialog" aria-modal="true">
      <button
        onClick={handleClose}
        aria-label="Close image viewer"
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded p-2 transition-colors"
      >
        ✕
      </button>
      {showImage && (
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          <button onClick={toggleFitMode} className="text-white text-xs bg-black/50 hover:bg-black/70 px-2 py-1 rounded">{fitMode ? 'Original' : 'Fit'}</button>
          {fitMode && <button onClick={zoomOut} className="text-white bg-black/50 hover:bg-black/70 px-2 py-1 rounded" aria-label="Zoom out">-</button>}
          {fitMode && <button onClick={zoomIn} className="text-white bg-black/50 hover:bg-black/70 px-2 py-1 rounded" aria-label="Zoom in">+</button>}
          {fitMode && <button onClick={resetView} className="text-white text-xs bg-black/50 hover:bg-black/70 px-2 py-1 rounded" aria-label="Reset zoom">100%</button>}
        </div>
      )}
      {showImage && fitMode && (
        <div
          ref={imgContainerRef}
          onWheel={handleWheel}
          onMouseDown={startPan}
          onMouseMove={onPan}
          onMouseLeave={endPan}
          onMouseUp={endPan}
          className={`relative max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-hidden flex items-center justify-center select-none ${isPanning ? 'cursor-grabbing' : scale !== 1 ? 'cursor-grab' : 'cursor-default'}`}
        >
          <img
            src={imageModal.imageSrc}
            alt="Full size"
            draggable={false}
            className="max-w-full max-h-full object-contain pointer-events-none rounded"
            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isPanning ? 'none' : 'transform 0.12s ease-out' }}
          />
          <div className="absolute bottom-2 left-2 text-white text-[11px] opacity-70">Ctrl+Wheel = Zoom | Wheel = Pan | Drag = Pan</div>
        </div>
      )}
      {showImage && !fitMode && (
        <div className="relative max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-auto">
          <img
            src={imageModal.imageSrc}
            alt="Full size"
            draggable={false}
            className="block mx-auto rounded"
          />
          <div className="absolute bottom-2 left-2 text-white text-[11px] opacity-70">Scroll to view | Switch back with Fit</div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
