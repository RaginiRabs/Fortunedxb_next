'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ProjectFormContext = createContext(null);

const STORAGE_KEY = 'project_form_data';

// Initial form state
const initialFormData = {
  // Step 1: Basic Details
  developer_id: '',
  project_name: '',
  sub_headline: '',
  project_logo: null,
  project_logo_preview: '',
  city: 'Dubai',
  country: 'UAE',
  locality: '',
  project_address: '', // NEW: Full physical address
  project_code: '', // Auto-generated: DXB-EMR2025001
  usage_type: '',
  project_type: '',
  project_status: '',

  // Step 2: Project Information
  total_towers: '',
  total_units: '',
  furnishing_status: '',
  handover_date: '',
  // REMOVED: completion_date
  featured: false,
  // REMOVED: youtube_link
  location_link: '',

  // Step 3: Pricing & Configuration
  // Updated configuration structure with range support
  configurations: [],
  /* Configuration object structure:
  {
    type: 'Studio',
    is_range: false,
    area_min: '450',
    area_max: '450',
    area_unit: 'sqft',
    price_min: '850000',
    price_max: '850000',
    currency: 'AED',
    units_available: '10'
  }
  */
  booking_amount: '',
  payment_plan: '',
  roi: '',

  // Step 4: Content
  about: '',
  highlights: [],
  faqs: [],

  // Step 5: Location & Contact
  amenities: [],
  nearby_locations: [],
  email_1: '',
  email_2: '',
  phone_1: '',
  phone_1_ccode: '', // Country calling code (e.g., "971")
  phone_2: '',
  phone_2_ccode: '', // Country calling code (e.g., "971")

  // Step 6: Media & SEO
  gallery_images: [],
  floor_plans: [],
  brochure: null,
  brochure_name: '',
  video_url: '', // NEW: Video URL
  // NEW: Additional file types
  tax_sheets: [],
  unit_plans: [],
  payment_plans: [],
  
  // Existing files (for edit mode)
  existing_gallery: [],
  existing_floor_plans: [],
  existing_brochure: null,
  existing_tax_sheets: [],
  existing_unit_plans: [],
  existing_payment_plans: [],
  
  // Deleted file IDs (for edit mode)
  deleted_gallery_ids: [],
  deleted_floorplan_ids: [],
  deleted_taxsheet_ids: [],
  deleted_unitplan_ids: [],
  deleted_paymentplan_ids: [],
  
  // SEO
  seo_developer_name: '',
  seo_city: '',
  meta_title: '',
  meta_keywords: '',
  meta_description: '',
  rich_snippets: '',
};

// Empty configuration template
export const emptyConfiguration = {
  type: '',
  is_range: false,
  area_min: '',
  area_max: '',
  area_unit: 'sqft',
  price_min: '',
  price_max: '',
  currency: 'AED',
  units_available: '',
};

// Area unit options
export const AREA_UNITS = [
  { value: 'sqft', label: 'Sq.Ft' },
  { value: 'sqm', label: 'Sq.M' },
];

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'AED', label: 'AED' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

export function ProjectFormProvider({ children, editMode = false, projectId = null, initialData = null }) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(editMode);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data from localStorage on mount (only for add mode)
  useEffect(() => {
    if (!editMode) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Don't restore file objects from localStorage
          setFormData({
            ...initialFormData,
            ...parsed,
            project_logo: null,
            gallery_images: [],
            floor_plans: [],
            brochure: null,
            tax_sheets: [],
            unit_plans: [],
            payment_plans: [],
          });
        } catch (e) {
          console.error('Failed to parse saved form data:', e);
        }
      }
    }
  }, [editMode]);

  // Load project data for edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        ...initialFormData,
        ...initialData,
        deleted_gallery_ids: [],
        deleted_floorplan_ids: [],
        deleted_taxsheet_ids: [],
        deleted_unitplan_ids: [],
        deleted_paymentplan_ids: [],
      });
      setIsLoading(false);
    }
  }, [editMode, initialData]);

  // Save to localStorage on formData change (only for add mode, exclude files)
  useEffect(() => {
    if (!editMode) {
      const dataToSave = {
        ...formData,
        project_logo: null,
        project_logo_preview: '',
        gallery_images: [],
        floor_plans: [],
        brochure: null,
        brochure_name: '',
        tax_sheets: [],
        unit_plans: [],
        payment_plans: [],
        existing_gallery: [],
        existing_floor_plans: [],
        existing_brochure: null,
        existing_tax_sheets: [],
        existing_unit_plans: [],
        existing_payment_plans: [],
        deleted_gallery_ids: [],
        deleted_floorplan_ids: [],
        deleted_taxsheet_ids: [],
        deleted_unitplan_ids: [],
        deleted_paymentplan_ids: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, editMode]);

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update multiple fields
  const updateFields = (fields) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Add deleted gallery file ID
  const addDeletedGalleryId = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      deleted_gallery_ids: [...prev.deleted_gallery_ids, fileId],
    }));
  };

  // Add deleted floorplan file ID
  const addDeletedFloorplanId = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      deleted_floorplan_ids: [...prev.deleted_floorplan_ids, fileId],
    }));
  };

  // Add deleted taxsheet file ID
  const addDeletedTaxsheetId = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      deleted_taxsheet_ids: [...prev.deleted_taxsheet_ids, fileId],
    }));
  };

  // Add deleted unitplan file ID
  const addDeletedUnitplanId = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      deleted_unitplan_ids: [...prev.deleted_unitplan_ids, fileId],
    }));
  };

  // Add deleted paymentplan file ID
  const addDeletedPaymentplanId = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      deleted_paymentplan_ids: [...prev.deleted_paymentplan_ids, fileId],
    }));
  };

  // Clear all form data
  const clearForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Validate step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.developer_id) newErrors.developer_id = 'Developer is required';
        if (!formData.project_name?.trim()) newErrors.project_name = 'Project name is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        if (!formData.usage_type) newErrors.usage_type = 'Usage type is required';
        if (!formData.project_status) newErrors.project_status = 'Project status is required';
        break;

      case 2:
        // No required fields in step 2
        break;

      case 3:
        // No required fields in step 3
        break;

      case 4:
        // No required fields in step 4
        break;

      case 5:
        // No required fields in step 5
        break;

      case 6:
        // SEO verification will happen on backend
        if (formData.seo_city && formData.seo_city !== formData.city) {
          newErrors.seo_city = 'City must match project city';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      return true;
    }
    return false;
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Go to specific step
  const goToStep = (step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  };

  // Get form data for API submission
  const getSubmitData = () => {
    return {
      // Basic
      developer_id: formData.developer_id,
      project_name: formData.project_name,
      sub_headline: formData.sub_headline || null,
      city: formData.city,
      country: formData.country,
      locality: formData.locality || null,
      project_address: formData.project_address || null, // NEW
      project_code: formData.project_code || null,
      usage_type: formData.usage_type,
      project_type: formData.project_type || null,
      project_status: formData.project_status,

      // Info
      total_towers: formData.total_towers || null,
      total_units: formData.total_units || null,
      furnishing_status: formData.furnishing_status || null,
      handover_date: formData.handover_date || null,
      // REMOVED: completion_date
      featured: formData.featured,
      // REMOVED: youtube_link
      location_link: formData.location_link || null,

      // Pricing
      configurations: formData.configurations,
      booking_amount: formData.booking_amount || null,
      payment_plan: formData.payment_plan || null,
      roi: formData.roi || null,

      // Content
      about: formData.about || null,
      highlights: formData.highlights,
      faqs: formData.faqs,

      // Location & Contact
      amenities: formData.amenities,
      nearby_locations: formData.nearby_locations,
      email_1: formData.email_1 || null,
      email_2: formData.email_2 || null,
      phone_1: formData.phone_1 || null,
      phone_1_ccode: formData.phone_1_ccode || null,
      phone_2: formData.phone_2 || null,
      phone_2_ccode: formData.phone_2_ccode || null,

      // Media
      video_url: formData.video_url || null, // NEW

      // SEO
      seo_developer_name: formData.seo_developer_name || null,
      seo_city: formData.seo_city || null,
      meta_title: formData.meta_title || null,
      meta_keywords: formData.meta_keywords || null,
      meta_description: formData.meta_description || null,
      rich_snippets: formData.rich_snippets || null,
      
      // Deleted file IDs (for edit mode)
      deleted_gallery_ids: formData.deleted_gallery_ids,
      deleted_floorplan_ids: formData.deleted_floorplan_ids,
      deleted_taxsheet_ids: formData.deleted_taxsheet_ids,
      deleted_unitplan_ids: formData.deleted_unitplan_ids,
      deleted_paymentplan_ids: formData.deleted_paymentplan_ids,
    };
  };

  // Get files for upload
  const getFiles = () => {
    return {
      project_logo: formData.project_logo,
      gallery_images: formData.gallery_images,
      floor_plans: formData.floor_plans,
      brochure: formData.brochure,
      tax_sheets: formData.tax_sheets,
      unit_plans: formData.unit_plans,
      payment_plans: formData.payment_plans,
    };
  };

  const value = {
    formData,
    currentStep,
    isLoading,
    isSaving,
    errors,
    editMode,
    projectId,
    updateField,
    updateFields,
    addDeletedGalleryId,
    addDeletedFloorplanId,
    addDeletedTaxsheetId,
    addDeletedUnitplanId,
    addDeletedPaymentplanId,
    clearForm,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    setCurrentStep,
    setIsSaving,
    setErrors,
    getSubmitData,
    getFiles,
  };

  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  );
}

export function useProjectForm() {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error('useProjectForm must be used within a ProjectFormProvider');
  }
  return context;
}

export default ProjectFormContext;