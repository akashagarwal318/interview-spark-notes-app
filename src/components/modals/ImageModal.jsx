
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

  const handleClose = useCallback(() => {
    dispatch(setImageModal({ isOpen: false, imageSrc: '' }));
  }, [dispatch]);

  // Reset state when a new image opens
  useEffect(() => {
    if (imageModal.isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setFitMode(true);
    }
  }, [imageModal.isOpen, imageModal.imageSrc]);

  // Esc key to close modal
  useEffect(() => {
    if (!imageModal.isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageModal.isOpen, handleClose]);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (!imageModal.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [imageModal.isOpen]);

  const clampScale = (s) => Math.min(5, Math.max(0.2, s));

  // Wheel handler via useEffect for { passive: false } support
  useEffect(() => {
    const el = imgContainerRef.current;
    if (!el || !fitMode || !imageModal.isOpen) return;

    const handler = (e) => {
      e.preventDefault(); // always prevent background scroll inside modal
      const zoomGesture = e.ctrlKey || e.metaKey;
      if (zoomGesture) {
        const rect = el.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? -0.12 : 0.12;
        setScale(prev => {
          const next = clampScale(prev + delta);
          const factor = next / prev - 1;
          setPosition(p => ({ x: p.x - cursorX * factor, y: p.y - cursorY * factor }));
          return next;
        });
      } else {
        // Pan with wheel
        setPosition(p => ({ x: p.x - (e.deltaX || 0) * 0.5, y: p.y - e.deltaY * 0.5 }));
      }
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [fitMode, imageModal.isOpen]);

  const startPan = (e) => {
    if (!fitMode) return;
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

  // Close on backdrop click (not on image/toolbar)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!imageModal.isOpen) return null;

  const zoomPercent = Math.round(scale * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 select-none"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {/* Top Toolbar */}
      {showImage && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/70 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Mode & Zoom controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFitMode}
              className="text-white/90 text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-md transition-colors font-medium"
            >
              {fitMode ? '📐 Fit' : '🔍 Original'}
            </button>

            {fitMode && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-md overflow-hidden ml-1">
                <button
                  onClick={zoomOut}
                  className="text-white/90 hover:bg-white/20 px-2.5 py-1.5 text-sm font-bold transition-colors"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  −
                </button>
                <span className="text-white/90 text-xs font-mono px-2 min-w-[3rem] text-center border-x border-white/10">
                  {zoomPercent}%
                </span>
                <button
                  onClick={zoomIn}
                  className="text-white/90 hover:bg-white/20 px-2.5 py-1.5 text-sm font-bold transition-colors"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  +
                </button>
              </div>
            )}

            {fitMode && scale !== 1 && (
              <button
                onClick={resetView}
                className="text-white/90 text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-md transition-colors"
                aria-label="Reset zoom"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right: Close */}
          <button
            onClick={handleClose}
            aria-label="Close image viewer"
            className="text-white/90 bg-white/10 hover:bg-red-500/80 rounded-md p-1.5 transition-colors backdrop-blur-sm"
            title="Close (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* Image: Fit mode (zoomable) */}
      {showImage && fitMode && (
        <div
          ref={imgContainerRef}
          onMouseDown={startPan}
          onMouseMove={onPan}
          onMouseLeave={endPan}
          onMouseUp={endPan}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-[90vw] h-[85vh] overflow-hidden flex items-center justify-center ${isPanning ? 'cursor-grabbing' : scale !== 1 ? 'cursor-grab' : 'cursor-default'}`}
        >
          <img
            src={imageModal.imageSrc}
            alt="Full size"
            draggable={false}
            className="max-w-full max-h-full object-contain pointer-events-none rounded"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isPanning ? 'none' : 'transform 0.15s ease-out'
            }}
          />
        </div>
      )}

      {/* Image: Original mode (scrollable) */}
      {showImage && !fitMode && (
        <div
          className="relative w-[90vw] h-[85vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageModal.imageSrc}
            alt="Full size"
            draggable={false}
            className="block mx-auto rounded"
          />
        </div>
      )}

      {/* Bottom hint */}
      {showImage && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/50 text-[11px] bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
          {fitMode ? 'Ctrl+Wheel = Zoom · Wheel = Pan · Drag = Pan · Esc = Close' : 'Scroll to view · Esc = Close'}
        </div>
      )}
    </div>
  );
};

export default ImageModal;
