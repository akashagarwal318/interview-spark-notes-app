
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { setImageModal } from '../../store/slices/uiSlice';

const ImageModal = () => {
  const dispatch = useDispatch();
  const { imageModal } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(setImageModal({ isOpen: false, imageSrc: '' }));
  };

  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState(true); // true = contain; false = original (scroll)
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const imgContainerRef = useRef(null);

  const clampScale = (s) => Math.min(5, Math.max(0.2, s));

  const handleWheel = useCallback((e) => {
    if (!fitMode) return; // in original size mode we let native scrolling happen
    // Zoom when Ctrl / Meta held; otherwise pan vertically when zoomed
    const zoomGesture = e.ctrlKey || e.metaKey;
    if (zoomGesture) {
      e.preventDefault();
      const rect = imgContainerRef.current?.getBoundingClientRect();
      const cursorX = e.clientX - (rect?.left || 0);
      const cursorY = e.clientY - (rect?.top || 0);
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      setScale(prev => {
        const newScale = clampScale(prev + delta);
        const factor = newScale / prev - 1;
        setPosition(p => ({ x: p.x - cursorX * factor, y: p.y - cursorY * factor }));
        return newScale;
      });
    } else if (scale > 1) {
      e.preventDefault();
      setPosition(p => ({ x: p.x - (e.shiftKey ? e.deltaY : 0), y: p.y - e.deltaY }));
    }
  }, [fitMode, scale]);

  const startPan = (e) => {
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const onPan = (e) => {
    if (!isPanning) return;
    setPosition({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const endPan = () => setIsPanning(false);

  const zoomIn = () => { if (fitMode) setScale(s => clampScale(s + 0.25)); };
  const zoomOut = () => { if (fitMode) setScale(s => clampScale(s - 0.25)); };
  const resetView = () => { setScale(1); setPosition({ x: 0, y: 0 }); };
  const toggleFitMode = () => {
    if (fitMode) {
      // switching to original size -> reset transforms
      resetView();
      setFitMode(false);
    } else {
      setFitMode(true);
    }
  };

  const showImage = Boolean(imageModal.imageSrc);

  // Reset view whenever a new image opens or modal re-opens
  useEffect(() => {
    if (imageModal.isOpen && imageModal.imageSrc) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setFitMode(true);
    }
  }, [imageModal.isOpen, imageModal.imageSrc]);

  return (
    <Modal
      open={imageModal.isOpen}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', width: '90vw', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* Toolbar */}
        {showImage && (
          <Box sx={{ position: 'absolute', left: 16, top: 8, zIndex: 1, display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={toggleFitMode} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 11, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
              {fitMode ? 'Original' : 'Fit'}
            </IconButton>
            {fitMode && <IconButton size="small" onClick={zoomOut} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>-</IconButton>}
            {fitMode && <IconButton size="small" onClick={zoomIn} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>+</IconButton>}
            {fitMode && <IconButton size="small" onClick={resetView} sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: 12, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>100%</IconButton>}
          </Box>
        )}
        {showImage && fitMode && (
          <Box
            ref={imgContainerRef}
            onWheel={handleWheel}
            onMouseDown={startPan}
            onMouseMove={onPan}
            onMouseLeave={endPan}
            onMouseUp={endPan}
            sx={{
              flex: 1,
              overflow: 'hidden',
              cursor: isPanning ? 'grabbing' : scale !== 1 ? 'grab' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              userSelect: 'none'
            }}
          >
            <Box
              component="img"
              src={imageModal.imageSrc}
              alt="Full size"
              draggable={false}
              sx={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isPanning ? 'none' : 'transform 0.12s ease-out',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 1,
                pointerEvents: 'none'
              }}
            />
            {/* Hint */}
            <Box sx={{ position: 'absolute', bottom: 8, left: 8, color: 'white', fontSize: 11, opacity: 0.7 }}>
              Ctrl+Wheel = Zoom | Wheel = Pan | Drag = Pan
            </Box>
          </Box>
        )}
        {showImage && !fitMode && (
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              position: 'relative'
            }}
          >
            <Box
              component="img"
              src={imageModal.imageSrc}
              alt="Full size"
              draggable={false}
              sx={{
                display: 'block',
                margin: '0 auto',
                objectFit: 'unset',
                borderRadius: 1
              }}
            />
            <Box sx={{ position: 'absolute', bottom: 8, left: 8, color: 'white', fontSize: 11, opacity: 0.7 }}>
              Scroll to view | Switch back with Fit button
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ImageModal;
