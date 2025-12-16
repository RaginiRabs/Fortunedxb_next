'use client';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, Filter } from 'lucide-react';

const SearchBox = ({
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  setFilterDrawerOpen,
  popularAreas,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Search Input */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: { xs: 0.75, md: 1 },
          gap: { xs: 0.5, sm: 0 },
        }}
      >
        <TextField
          fullWidth
          placeholder={isMobile ? "Search projects..." : "Search by project, developer, or area..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Search size={isMobile ? 20 : 24} color="#C6A962" style={{ marginLeft: isMobile ? 8 : 16, marginRight: 8 }} />
              </InputAdornment>
            ),
            sx: {
              fontSize: { xs: '0.85rem', md: '1.1rem' },
              py: { xs: 1, md: 1.5 },
              px: 1,
              fontFamily: '"Quicksand", sans-serif',
            },
          }}
        />
        
        {/* Mobile: Icon Button | Desktop: Full Button */}
        {isMobile ? (
          <IconButton
            sx={{
              background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
              borderRadius: 1,
              width: 44,
              height: 44,
              mr: 0.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
              },
            }}
          >
            <Search size={20} color="#FFFFFF" />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #C6A962 0%, #A68B4B 100%)',
              color: '#FFFFFF',
              borderRadius: 1,
              px: 4,
              py: 1.5,
              mr: 1,
              minWidth: 140,
              boxShadow: '0 4px 15px rgba(198, 169, 98, 0.4)',
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #D4BC7D 0%, #C6A962 100%)',
              },
            }}
          >
            Search
          </Button>
        )}
      </Box>

      {/* Quick Filters */}
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'row' },
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          p: { xs: 1.5, md: 2 },
          bgcolor: 'rgba(0,0,0,0.02)',
        }}
      >
        <FormControl size="small" sx={{ minWidth: { xs: 90, sm: 140 }, flex: { xs: 1, sm: 'none' } }}>
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            Area
          </InputLabel>
          <Select
            value={selectedArea}
            label="Area"
            onChange={(e) => setSelectedArea(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            <MenuItem value="">All Areas</MenuItem>
            {popularAreas?.map((area) => (
              <MenuItem key={area.name} value={area.name}>
                {area.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: 90, sm: 140 }, flex: { xs: 1, sm: 'none' } }}>
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            Type
          </InputLabel>
          <Select
            value={propertyType}
            label="Type"
            onChange={(e) => setPropertyType(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="villa">Villa</MenuItem>
            <MenuItem value="townhouse">Townhouse</MenuItem>
            <MenuItem value="penthouse">Penthouse</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: 70, sm: 120 }, flex: { xs: 1, sm: 'none' } }}>
          <InputLabel
            sx={{
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            Beds
          </InputLabel>
          <Select
            value={bedrooms}
            label="Beds"
            onChange={(e) => setBedrooms(e.target.value)}
            sx={{
              borderRadius: 1,
              fontFamily: '"Quicksand", sans-serif',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="studio">Studio</MenuItem>
            <MenuItem value="1">1 BR</MenuItem>
            <MenuItem value="2">2 BR</MenuItem>
            <MenuItem value="3">3 BR</MenuItem>
            <MenuItem value="4+">4+ BR</MenuItem>
          </Select>
        </FormControl>

        {/* Mobile: Icon only | Desktop: Full button */}
        {isMobile ? (
          <IconButton
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              width: 40,
              height: 40,
            }}
          >
            <Filter size={18} />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Filter size={18} />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              borderRadius: 1,
              borderColor: 'divider',
              fontFamily: '"Quicksand", sans-serif',
              fontWeight: 600,
            }}
          >
            More Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default SearchBox;