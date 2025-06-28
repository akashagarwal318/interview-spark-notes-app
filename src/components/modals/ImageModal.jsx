
import React from 'react';
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
      <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
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
        <Box
          component="img"
          src={imageModal.imageSrc}
          alt="Full size"
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 1
          }}
        />
      </Box>
    </Modal>
  );
};

export default ImageModal;
