'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProjectFormContext = createContext(null);

const STORAGE_KEY = 'project_form_data';

// Empty configuration template - with unit_plan_ids
export const emptyConfiguration = {
  type: '',
  is_range: false,
  units_available: '',
  area_min: '',
  area_max: '',
  area_unit: 'sqft',
  price_min: '',
  price_max: '',
  currency: 'AED',
  unit_plan_ids: [],        // Existing unit plan file IDs from DB
  unit_plan_files: [],      // New files to upload (File objects)
  deleted_unit_plan_ids: [], // IDs to delete on save
  existing_unit_plans: [],  // Existing file objects for display
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
  project_address: '',
  project_code: '',
  usage_type: '',
  project_type: '',
  project_status: '',

  // Step 2: Project Information + Contact (MOVED HERE)
  total_towers: '',
  total_units: '',
  furnishing_status: '',
  handover_date: '',
  featured: false,
  email_1: '',
  email_2: '',
  phone_1: '',
  phone_1_ccode: '',
  phone_2: '',
  phone_2_ccode: '',

  // Step 3: Pricing & Configuration (with unit plans per config)
  configurations: [],
  booking_amount: '',
  payment_plan: '',
  roi: '',

  // Step 4: Content (with amenities)
  about: '',
  highlights: [],
  faqs: [],
  amenities: [],

  // Step 5: Location (simplified - only map + nearby)
  location_link: '',
  nearby_locations: [],

  // Step 6: Media & SEO (unit plans REMOVED - now in configurations)
  video_url: '',
  gallery_images: [],
  floor_plans: [],
  brochure: null,
  brochure_name: '',
  tax_sheets: [],
  payment_plans: [],

  // Existing files (for edit mode)
  existing_gallery: [],
  existing_floor_plans: [],
  existing_brochure: null,
  existing_tax_sheets: [],
  existing_payment_plans: [],

  // Deleted file IDs (for edit mode)
  deleted_gallery_ids: [],
  deleted_floorplan_ids: [],
  deleted_taxsheet_ids: [],
  deleted_paymentplan_ids: [],

  // SEO
  seo_developer_name: '',
  seo_city: '',
  meta_title: '',
  meta_keywords: '',
  meta_description: '',
  rich_snippets: '',
};

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
          setFormData({
            ...initialFormData,
            ...parsed,
            project_logo: null,
            gallery_images: [],
            floor_plans: [],
            brochure: null,
            tax_sheets: [],
            payment_plans: [],
            configurations: (parsed.configurations || []).map(config => ({
              ...config,
              unit_plan_files: [],
              existing_unit_plans: [],
            })),
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
      // Get all unit plan files
      const unitPlanFiles = initialData.files?.unitplan || [];

      // Parse configurations and attach existing unit plans
      const configurations = (initialData.configurations || []).map((config, index) => {
        const configUnitPlans = unitPlanFiles.filter(f =>
          (config.unit_plan_ids || []).includes(f.file_id)
        );
        return {
          ...config,
          unit_plan_ids: config.unit_plan_ids || [],
          unit_plan_files: [],
          deleted_unit_plan_ids: [],
          existing_unit_plans: configUnitPlans,
        };
      });

      setFormData({
        ...initialFormData,
        ...initialData,
        configurations,
        deleted_gallery_ids: [],
        deleted_floorplan_ids: [],
        deleted_taxsheet_ids: [],
        deleted_paymentplan_ids: [],
      });
      setIsLoading(false);
    }
  }, [editMode, initialData]);

  // Save to localStorage on formData change (only for add mode)
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
        payment_plans: [],
        existing_gallery: [],
        existing_floor_plans: [],
        existing_brochure: null,
        existing_tax_sheets: [],
        existing_payment_plans: [],
        deleted_gallery_ids: [],
        deleted_floorplan_ids: [],
        deleted_taxsheet_ids: [],
        deleted_paymentplan_ids: [],
        configurations: formData.configurations.map(config => ({
          ...config,
          unit_plan_files: [],
          existing_unit_plans: [],
          deleted_unit_plan_ids: [],
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, editMode]);

  // Update form field
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Update multiple fields
  const updateFields = useCallback((fields) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  // Add unit plan file to configuration
  const addUnitPlanToConfig = useCallback((configIndex, file) => {
    setFormData((prev) => {
      const updated = [...prev.configurations];
      const config = { ...updated[configIndex] };
      config.unit_plan_files = [...(config.unit_plan_files || []), file];
      updated[configIndex] = config;
      return { ...prev, configurations: updated };
    });
  }, []);

  // Remove new unit plan file from configuration (not yet saved)
  const removeUnitPlanFileFromConfig = useCallback((configIndex, fileIndex) => {
    setFormData((prev) => {
      const updated = [...prev.configurations];
      const config = { ...updated[configIndex] };
      config.unit_plan_files = config.unit_plan_files.filter((_, i) => i !== fileIndex);
      updated[configIndex] = config;
      return { ...prev, configurations: updated };
    });
  }, []);

  // Mark existing unit plan for deletion
  const markUnitPlanForDeletion = useCallback((configIndex, fileId) => {
    setFormData((prev) => {
      const updated = [...prev.configurations];
      const config = { ...updated[configIndex] };

      // Remove from unit_plan_ids
      config.unit_plan_ids = (config.unit_plan_ids || []).filter(id => id !== fileId);

      // Remove from existing_unit_plans display
      config.existing_unit_plans = (config.existing_unit_plans || []).filter(f => f.file_id !== fileId);

      // Add to deleted list
      config.deleted_unit_plan_ids = [...(config.deleted_unit_plan_ids || []), fileId];

      updated[configIndex] = config;
      return { ...prev, configurations: updated };
    });
  }, []);

  // Add deleted IDs for other file types
  const addDeletedGalleryId = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      deleted_gallery_ids: [...prev.deleted_gallery_ids, id],
    }));
  }, []);

  const addDeletedFloorplanId = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      deleted_floorplan_ids: [...prev.deleted_floorplan_ids, id],
    }));
  }, []);

  const addDeletedTaxsheetId = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      deleted_taxsheet_ids: [...prev.deleted_taxsheet_ids, id],
    }));
  }, []);

  const addDeletedPaymentplanId = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      deleted_paymentplan_ids: [...prev.deleted_paymentplan_ids, id],
    }));
  }, []);

  // Clear all form data
  const clearForm = useCallback(() => {
    setFormData(initialFormData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Validate step
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.developer_id) newErrors.developer_id = 'Developer is required';
        if (!formData.project_name?.trim()) newErrors.project_name = 'Project name is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        if (!formData.usage_type) newErrors.usage_type = 'Usage type is required';
        if (!formData.project_status) newErrors.project_status = 'Project status is required';
        break;
      case 6:
        if (formData.seo_city && formData.seo_city !== formData.city) {
          newErrors.seo_city = 'City must match project city';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Go to specific step
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  // Get form data for API submission
  const getSubmitData = useCallback(() => {
    // Prepare configurations without File objects
    const configurationsForSubmit = formData.configurations.map(config => ({
      type: config.type,
      is_range: config.is_range,
      units_available: config.units_available,
      area_min: config.area_min,
      area_max: config.area_max,
      area_unit: config.area_unit,
      price_min: config.price_min,
      price_max: config.price_max,
      currency: config.currency,
      unit_plan_ids: config.unit_plan_ids || [],
      deleted_unit_plan_ids: config.deleted_unit_plan_ids || [],
    }));

    return {
      developer_id: formData.developer_id,
      project_name: formData.project_name,
      sub_headline: formData.sub_headline || null,
      city: formData.city,
      country: formData.country,
      locality: formData.locality || null,
      project_address: formData.project_address || null,
      project_code: formData.project_code || null,
      usage_type: formData.usage_type,
      project_type: formData.project_type || null,
      project_status: formData.project_status,
      total_towers: formData.total_towers || null,
      total_units: formData.total_units || null,
      furnishing_status: formData.furnishing_status || null,
      handover_date: formData.handover_date || null,
      featured: formData.featured,
      email_1: formData.email_1 || null,
      email_2: formData.email_2 || null,
      phone_1: formData.phone_1 || null,
      phone_1_ccode: formData.phone_1_ccode || null,
      phone_2: formData.phone_2 || null,
      phone_2_ccode: formData.phone_2_ccode || null,
      location_link: formData.location_link || null,
      video_url: formData.video_url || null,
      configurations: configurationsForSubmit,
      booking_amount: formData.booking_amount || null,
      payment_plan: formData.payment_plan || null,
      roi: formData.roi || null,
      about: formData.about || null,
      highlights: formData.highlights,
      faqs: formData.faqs,
      amenities: formData.amenities,
      nearby_locations: formData.nearby_locations,
      seo_developer_name: formData.seo_developer_name || null,
      seo_city: formData.seo_city || null,
      meta_title: formData.meta_title || null,
      meta_keywords: formData.meta_keywords || null,
      meta_description: formData.meta_description || null,
      rich_snippets: formData.rich_snippets || null,
      deleted_gallery_ids: formData.deleted_gallery_ids,
      deleted_floorplan_ids: formData.deleted_floorplan_ids,
      deleted_taxsheet_ids: formData.deleted_taxsheet_ids,
      deleted_paymentplan_ids: formData.deleted_paymentplan_ids,
    };
  }, [formData]);

  // Get files for upload
  const getFiles = useCallback(() => {
    // Collect unit plan files from all configurations
    const configUnitPlans = [];
    formData.configurations.forEach((config, configIndex) => {
      (config.unit_plan_files || []).forEach((file, fileIndex) => {
        configUnitPlans.push({
          configIndex,
          fileIndex,
          file,
        });
      });
    });

    return {
      project_logo: formData.project_logo,
      gallery_images: formData.gallery_images || [],
      floor_plans: formData.floor_plans || [],
      brochure: formData.brochure,
      tax_sheets: formData.tax_sheets || [],
      payment_plans: formData.payment_plans || [],
      config_unit_plans: configUnitPlans,
    };
  }, [formData]);

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
    addUnitPlanToConfig,
    removeUnitPlanFileFromConfig,
    markUnitPlanForDeletion,
    addDeletedGalleryId,
    addDeletedFloorplanId,
    addDeletedTaxsheetId,
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