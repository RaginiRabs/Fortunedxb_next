'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Backdrop,
} from '@mui/material';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  PictureAsPdfOutlined,
  CloseOutlined,
  ZoomInOutlined,
} from '@mui/icons-material';

export default function FileUpload({
  name,
  label,
  accept = 'image/*',
  maxSize = 5,
  helperText,
  existingFile,
  value,
  onChange,
  onRemove,
  error,
  touched,
  compact = false,
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isPdf = accept?.includes('pdf');

  useEffect(() => {
    if (value && value instanceof File) {
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(value);
      } else if (value.type === 'application/pdf') {
        setPreview('pdf');
      }
    } else if (!value && !existingFile) {
      setPreview(null);
    }
  }, [value, existingFile]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    onChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove();
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (isPdf) {
      const pdfUrl = existingFile
        ? existingFile.startsWith('/')
          ? existingFile
          : `/${existingFile}`
        : null;
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    } else if ((preview && preview !== 'pdf') || existingFile) {
      setLightboxOpen(true);
    }
  };

  const hasFile = value || existingFile;
  const displayPreview = preview || (existingFile ? (existingFile.startsWith('/') ? existingFile : `/${existingFile}`) : null);

  const boxSize = compact || isPdf ? 70 : 80;

  return (
    <Box >
      {/* Label */}
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {hasFile ? (
          /* Wrapper for Preview + Delete Button */
          <Box sx={{ position: 'relative' }}>
            {/* Delete Button - Outside the image box */}
            <IconButton
              size="small"
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: 'error.main',
                color: '#fff',
                width: 20,
                height: 20,
                zIndex: 2,
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              <DeleteOutlined sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Image Box */}
            <Box
              sx={{
                width: boxSize,
                height: boxSize,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.300',
                bgcolor: 'grey.50',
              }}
            >
              {isPdf || preview === 'pdf' ? (
                <Box
                  onClick={handlePreviewClick}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <PictureAsPdfOutlined sx={{ fontSize: 24, color: 'error.main' }} />
                    <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', color: 'text.secondary' }}>
                      PDF
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  onClick={handlePreviewClick}
                  sx={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover .zoom-icon': { opacity: 1 },
                  }}
                >
                  <img
                    src={displayPreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    className="zoom-icon"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <ZoomInOutlined sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          /* Upload Box */
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            sx={{
              width: 100,
              height: 40,
              borderRadius: 1,
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : error && touched ? 'error.main' : 'grey.300',
              bgcolor: dragActive ? 'primary.50' : 'grey.50',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            <CloudUploadOutlined sx={{ fontSize: 20, color: 'grey.500', mb: 0.5 }} />
            {/* <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.6rem' }}>
              Upload
            </Typography> */}
          </Box>
        )}

        {/* File name for existing file */}
        {hasFile && existingFile && !value && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }} noWrap>
              {typeof existingFile === 'string' ? existingFile.split('/').pop() : 'File'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Click to {isPdf ? 'open' : 'preview'}
            </Typography>
          </Box>
        )}

        {/* File name for new file */}
        {value && value instanceof File && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }} noWrap>
              {value.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Helper Text */}
      {helperText && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {/* Error */}
      {error && touched && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.9)' } },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              zIndex: 10,
            }}
          >
            <CloseOutlined />
          </IconButton>

          {displayPreview && displayPreview !== 'pdf' && (
            <Box
              component="img"
              src={displayPreview}
              alt="Preview"
              sx={{
                maxWidth: '85vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}