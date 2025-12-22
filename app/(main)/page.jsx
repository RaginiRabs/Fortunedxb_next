'use client';
import { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';

// Home Components
import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import ExclusiveOffers from '@/components/home/ExclusiveOffers';
import WhyInvestSection from '@/components/home/WhyInvestSection';
import FirstTimeBuyerSection from '@/components/home/FirstTimeBuyerSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TopDevelopers from '@/components/home/TopDevelopers';
import NewsletterSection from '@/components/home/NewsletterSection';

// Dialogs
import ROICalculatorDialog from '@/components/dialogs/ROICalculatorDialog';
import InquiryDialog from '@/components/dialogs/InquiryDialog';
import FilterDrawer from '@/components/dialogs/FilterDrawer';

// Data
import { popularAreas } from '@/data/popularAreas';
import { developers } from '@/data/developers';
import { sampleProjects } from '@/data/sampleProjects';

export default function Home() {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  // Filter Drawer States
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([500000, 10000000]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [completionYear, setCompletionYear] = useState('');
  const [paymentPlan, setPaymentPlan] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Dialog States
  const [roiCalculatorOpen, setRoiCalculatorOpen] = useState(false);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ROI Calculator States
  const [investmentAmount, setInvestmentAmount] = useState(2000000);
  const [expectedRoi, setExpectedRoi] = useState(8);

  // Save Property States
  const [savedProperties, setSavedProperties] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filter projects based on active tab
  const getFilteredProjects = () => {
    let filtered = sampleProjects;
    switch (activeTab) {
      case 1:
        filtered = sampleProjects.filter((p) => p.status === 'hot');
        break;
      case 2:
        filtered = sampleProjects.filter((p) => p.status === 'new');
        break;
      case 3:
        filtered = sampleProjects.filter((p) => p.status === 'upcoming');
        break;
      default:
        filtered = sampleProjects;
    }
    return filtered;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveProperty = (projectId) => {
    if (savedProperties.includes(projectId)) {
      setSavedProperties(savedProperties.filter((id) => id !== projectId));
      setSnackbar({ open: true, message: 'Property removed from saved', severity: 'info' });
    } else {
      setSavedProperties([...savedProperties, projectId]);
      setSnackbar({ open: true, message: 'Property saved successfully!', severity: 'success' });
    }
  };

  const handleInquiry = (project) => {
    setSelectedProject(project);
    setInquiryDialogOpen(true);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        setFilterDrawerOpen={setFilterDrawerOpen}
        popularAreas={popularAreas}
      />

      {/* Featured Projects */}
      <FeaturedProjects
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredProjects={getFilteredProjects()}
        savedProperties={savedProperties}
        handleSaveProperty={handleSaveProperty}
        handleInquiry={handleInquiry}
      />

      {/* Exclusive Offers */}
      <ExclusiveOffers
        projectsWithOffers={sampleProjects}
        handleInquiry={handleInquiry}
      />

      {/* Why Invest Section */}
      <WhyInvestSection setRoiCalculatorOpen={setRoiCalculatorOpen} />

      {/* First Time Buyer Section */}
      <FirstTimeBuyerSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Top Developers */}
      <TopDevelopers developers={developers} />

      {/* Newsletter */}
      <NewsletterSection />

      {/* ROI Calculator Dialog */}
      <ROICalculatorDialog
        open={roiCalculatorOpen}
        onClose={() => setRoiCalculatorOpen(false)}
        investmentAmount={investmentAmount}
        setInvestmentAmount={setInvestmentAmount}
        expectedRoi={expectedRoi}
        setExpectedRoi={setExpectedRoi}
      />

      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
        selectedProject={selectedProject}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedDeveloper={selectedDeveloper}
        setSelectedDeveloper={setSelectedDeveloper}
        completionYear={completionYear}
        setCompletionYear={setCompletionYear}
        paymentPlan={paymentPlan}
        setPaymentPlan={setPaymentPlan}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        developers={developers}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}