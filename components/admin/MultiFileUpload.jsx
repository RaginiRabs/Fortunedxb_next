'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Backdrop,
} from '@mui/material';
import {
  DeleteOutlined,
  AddPhotoAlternateOutlined,
  CloseOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  ZoomInOutlined,
} from '@mui/icons-material';

export default function MultiFileUpload({
  name,
  label,
  accept = 'image/*',
  maxSize = 5,
  maxFiles = 20,
  helperText,
  existingFiles = [],
  value = [],
  onChange,
  onRemoveExisting,
  error,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  const totalFiles = existingFiles.length + value.length;
  const canAddMore = totalFiles < maxFiles;

  const handleFiles = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      const remainingSlots = maxFiles - totalFiles;
      const filesToAdd = fileArray.slice(0, remainingSlots);

      const validFiles = [];
      const newPreviews = [];

      filesToAdd.forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          return;
        }

        validFiles.push(file);

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push({ file, preview: e.target.result });
            if (newPreviews.length === validFiles.length) {
              setPreviews((prev) => [...prev, ...newPreviews]);
            }
          };
          reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
          newPreviews.push({ file, preview: 'pdf' });
          if (newPreviews.length === validFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        }
      });

      if (validFiles.length > 0) {
        onChange([...value, ...validFiles]);
      }
    },
    [value, onChange, maxSize, maxFiles, totalFiles]
  );

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && canAddMore) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (canAddMore) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemoveNew = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newValue);
  };

  const handleRemoveExisting = (file) => {
    if (onRemoveExisting) {
      onRemoveExisting(file);
    }
  };

  // Get all images for lightbox
  const getAllImages = () => {
    const images = [];
    existingFiles?.forEach((file) => {
      const filePath = file.file_path || file;
      const fileName = file.file_name || filePath;
      const isPdf = fileName?.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        const imageUrl = filePath.startsWith('/') ? filePath : `/${filePath}`;
        images.push({ url: imageUrl, type: 'existing', file });
      }
    });
    previews?.forEach((item) => {
      if (item.preview !== 'pdf') {
        images.push({ url: item.preview, type: 'new', file: item.file });
      }
    });
    return images;
  };

  // Open lightbox
  const openLightbox = (index, type) => {
    const allImages = getAllImages();
    let actualIndex = 0;

    if (type === 'existing') {
      actualIndex = index;
    } else {
      const existingImageCount = existingFiles.filter((f) => {
        const fileName = f.file_name || f.file_path || f;
        return !fileName?.toLowerCase().endsWith('.pdf');
      }).length;
      actualIndex = existingImageCount + index;
    }

    setLightboxImages(allImages);
    setLightboxIndex(actualIndex);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction) => {
    setLightboxIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return lightboxImages.length - 1;
      if (newIndex >= lightboxImages.length) return 0;
      return newIndex;
    });
  };

  const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toLowerCase() || '';
  };

  return (
    <Box>
      {/* Label */}
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
        {label} {totalFiles > 0 && `(${totalFiles}/${maxFiles})`}
      </Typography>

      {/* Compact Horizontal Layout */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
        {/* Existing Files */}
        {existingFiles.map((file, index) => {
          const filePath = file.file_path || file;
          const fileName = file.file_name || filePath;
          const isPdf = getFileExtension(fileName) === 'pdf';
          const imageUrl = filePath.startsWith('/') ? filePath : `/${filePath}`;

          return (
            <Box
              key={`existing-${index}`}
              sx={{ position: 'relative' }}
            >
              {/* Delete Button - Outside the image box */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveExisting(file);
                }}
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
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50',
                }}
              >
                {isPdf ? (
                  <Box
                    onClick={() => window.open(imageUrl, '_blank')}
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
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.25,
                          bgcolor: 'error.main',
                          color: '#fff',
                          borderRadius: 0.5,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                        }}
                      >
                        PDF
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => openLightbox(index, 'existing')}
                    sx={{
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover .zoom-icon': { opacity: 1 },
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={fileName}
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
                      <ZoomInOutlined sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        {/* New File Previews */}
        {previews.map((item, index) => {
          const isPdf = item.preview === 'pdf';

          return (
            <Box
              key={`new-${index}`}
              sx={{ position: 'relative' }}
            >
              {/* Delete Button - Outside the image box */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveNew(index);
                }}
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
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'grey.50',
                }}
              >
                {isPdf ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.25,
                          bgcolor: 'error.main',
                          color: '#fff',
                          borderRadius: 0.5,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                        }}
                      >
                        PDF
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => openLightbox(index, 'new')}
                    sx={{
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover .zoom-icon': { opacity: 1 },
                    }}
                  >
                    <img
                      src={item.preview}
                      alt={item.file.name}
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
                      <ZoomInOutlined sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        {/* Upload Button - Inline */}
        {canAddMore && (
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 2,
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.300',
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
            <AddPhotoAlternateOutlined sx={{ fontSize: 24, color: 'grey.500', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.65rem' }}>
              Add
            </Typography>
          </Box>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Helper Text */}
      {helperText && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {helperText} • Max {maxSize}MB each • Up to {maxFiles} files
        </Typography>
      )}

      {/* Error */}
      {error && (
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
          {/* Close Button */}
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

          {/* Previous Button */}
          {lightboxImages.length > 1 && (
            <IconButton
              onClick={() => navigateLightbox(-1)}
              sx={{
                position: 'fixed',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronLeftOutlined sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          {/* Next Button */}
          {lightboxImages.length > 1 && (
            <IconButton
              onClick={() => navigateLightbox(1)}
              sx={{
                position: 'fixed',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                zIndex: 10,
              }}
            >
              <ChevronRightOutlined sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          {/* Image */}
          {lightboxImages[lightboxIndex] && (
            <Box
              component="img"
              src={lightboxImages[lightboxIndex].url}
              alt="Preview"
              sx={{
                maxWidth: '85vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}

          {/* Counter */}
          {lightboxImages.length > 1 && (
            <Typography
              sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.5)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: 14,
              }}
            >
              {lightboxIndex + 1} / {lightboxImages.length}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}