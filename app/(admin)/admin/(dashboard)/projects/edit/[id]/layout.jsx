'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import ProjectStepper from '@/components/admin/projects/ProjectStepper';
import { ProjectFormProvider } from '@/contexts/ProjectFormContext';

export default function EditProjectLayout({ children }) {
  const params = useParams();
  const projectId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        const project = data.data;
        
        // Clean configurations - remove old fields, keep only new format
        const cleanConfigurations = (project.configurations || []).map(config => ({
          type: config.type || '',
          is_range: config.is_range || false,
          units_available: config.units_available || '',
          area_min: config.area_min || '',
          area_max: config.area_max || '',
          area_unit: config.area_unit || 'sqft',
          price_min: config.price_min || '',
          price_max: config.price_max || '',
          currency: config.currency || 'AED',
          unit_plan_ids: config.unit_plan_ids || [],
          // OLD fields like 'area', 'price' strings are NOT included
        }));
        
        // Transform API data to form data format
        const formattedData = {
          developer_id: project.developer_id,
          project_name: project.project_name,
          sub_headline: project.sub_headline || '',
          project_logo: null,
          project_logo_preview: project.project_logo ? `/${project.project_logo}` : '',
          city: project.city || 'Dubai',
          country: project.country || 'UAE',
          locality: project.locality || '',
          project_address: project.project_address || '',
          project_code: project.project_code || '',
          usage_type: project.usage_type || '',
          project_type: project.project_type || '',
          project_status: project.project_status || '',
          total_towers: project.total_towers || '',
          total_units: project.total_units || '',
          furnishing_status: project.furnishing_status || '',
          handover_date: project.handover_date ? project.handover_date.split('T')[0] : '',
          featured: project.featured || false,
          location_link: project.location_link || '',
          video_url: project.video_url || '',
          
          // Use cleaned configurations
          configurations: cleanConfigurations,
          files: project.files,
          booking_amount: project.booking_amount || '',
          payment_plan: project.payment_plan || '',
          roi: project.roi || '',
          about: project.about || '',
          highlights: project.highlights || [],
          faqs: project.faqs || [],
          amenities: project.amenities || [],
          nearby_locations: project.nearby_locations || [],
          email_1: project.email_1 || '',
          email_2: project.email_2 || '',
          phone_1: project.phone_1 || '',
          phone_1_ccode: project.phone_1_ccode || '',
          phone_2: project.phone_2 || '',
          phone_2_ccode: project.phone_2_ccode || '',
          
          // Gallery
          gallery_images: [],
          existing_gallery: project.files?.gallery || [],
          
          // Floor plans
          floor_plans: [],
          existing_floor_plans: project.files?.floorplan || [],
          
          // Brochure
          brochure: null,
          brochure_name: project.files?.brochure?.file_name || '',
          existing_brochure: project.files?.brochure?.file_path || null,
          
          // New file types
          tax_sheets: [],
          existing_tax_sheets: project.files?.taxsheet || [],
          unit_plans: [],
          existing_unit_plans: project.files?.unitplan || [],
          payment_plans: [],
          existing_payment_plans: project.files?.paymentplan || [],
          
          // SEO fields
          seo_developer_name: project.seo?.developer_name || '',
          seo_city: project.seo?.city || '',
          meta_title: project.seo?.meta_title || '',
          meta_keywords: project.seo?.meta_keywords || '',
          meta_description: project.seo?.meta_description || '',
          rich_snippets: project.seo?.rich_snippets || '',
        };
        
        setProjectData(formattedData);
      } else {
        setError(data.message || 'Project not found');
      }
    } catch (err) {
      setError('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <ProjectFormProvider editMode={true} projectId={projectId} initialData={projectData}>
      <Box>
        <Box sx={{ p: 0 }}>
          <ProjectStepper />
          {children}
        </Box>
      </Box>
    </ProjectFormProvider>
  );
}