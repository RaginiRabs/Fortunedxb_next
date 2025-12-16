'use client';
import { useState } from 'react';
import {
  Box,
  Fab,
  Zoom,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  Video,
} from 'lucide-react';

const actions = [
  {
    icon: <MessageCircle size={20} />,
    name: 'WhatsApp',
    href: 'https://api.whatsapp.com/send?phone=+971588529900&text=Hello,%20I%20Am%20Interested%20In%20Dubai%20Properties',
    bgColor: '#25D366',
    hoverColor: '#1DA851',
  },
  {
    icon: <Phone size={20} />,
    name: 'Call Us',
    href: 'tel:+971588529900',
    bgColor: '#0B1A2A',
    hoverColor: '#1E3A5F',
  },
  {
    icon: <Mail size={20} />,
    name: 'Email',
    href: 'mailto:info@fortunedxb.com',
    bgColor: '#C6A962',
    hoverColor: '#A68B4B',
  },
  {
    icon: <Video size={20} />,
    name: 'Video Call',
    href: '#',
    bgColor: '#4A90D9',
    hoverColor: '#3A7BC8',
  },
];

const FloatingContactDial = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const handleActionClick = (href) => {
    if (href && href !== '#') {
      window.open(href, href.startsWith('http') ? '_blank' : '_self');
    }
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          {actions.map((action, index) => (
            <Zoom
              key={action.name}
              in={open}
              style={{
                transitionDelay: open ? `${index * 50}ms` : '0ms',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {/* Tooltip Label - Desktop Only */}
                {/* {!isMobile && open && (
                  <Box
                    sx={{
                      bgcolor: '#0B1A2A',
                      color: '#FFFFFF',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: '"Quicksand", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    {action.name}
                  </Box>
                )} */}
                
                <Tooltip title={isMobile ? action.name : ''} placement="left">
                  <Fab
                    size="small"
                    onClick={() => handleActionClick(action.href)}
                    sx={{
                      bgcolor: action.bgColor,
                      color: '#FFFFFF',
                      borderRadius: 1,
                      width: 44,
                      height: 44,
                      minHeight: 44,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: action.hoverColor,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {action.icon}
                  </Fab>
                </Tooltip>
              </Box>
            </Zoom>
          ))}
        </Box>

        {/* Main FAB Button */}
        <Fab
          onClick={handleToggle}
          sx={{
            width: { xs: 52, md: 56 },
            height: { xs: 52, md: 56 },
            minHeight: { xs: 52, md: 56 },
            background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
            borderRadius: 1,
            boxShadow: '0 8px 25px rgba(198, 169, 98, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #A68B4B 0%, #8B7340 100%)',
              transform: 'scale(1.05)',
            },
          }}
        >
          {open ? (
            <X size={24} color="#FFFFFF" />
          ) : (
            <MessageCircle size={24} color="#FFFFFF" />
          )}
        </Fab>
      </Box>
    </ClickAwayListener>
  );
};

export default FloatingContactDial;