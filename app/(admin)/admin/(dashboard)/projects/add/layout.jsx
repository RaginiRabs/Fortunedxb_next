'use client';
import { Box } from '@mui/material';
import ProjectStepper from '@/components/admin/projects/ProjectStepper';
import { ProjectFormProvider } from '@/contexts/ProjectFormContext';

export default function AddProjectLayout({ children }) {
  return (
    <ProjectFormProvider>
      <Box>
        <Box sx={{ p: 0 }}>
          <ProjectStepper />
          {children}
        </Box>
      </Box>
    </ProjectFormProvider>
  );
}