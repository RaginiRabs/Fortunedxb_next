'use client';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import {
  InfoOutlined,
  BusinessOutlined,
  PaymentsOutlined,
  DescriptionOutlined,
  LocationOnOutlined,
  ImageOutlined,
  CheckCircle,
} from '@mui/icons-material';
import { useProjectForm } from '@/contexts/ProjectFormContext';

const steps = [
  { label: 'Basic Details', icon: InfoOutlined, path: 'basic' },
  { label: 'Project Info', icon: BusinessOutlined, path: 'info' },
  { label: 'Pricing', icon: PaymentsOutlined, path: 'pricing' },
  { label: 'Content', icon: DescriptionOutlined, path: 'content' },
  { label: 'Location', icon: LocationOnOutlined, path: 'location' },
  { label: 'Media & SEO', icon: ImageOutlined, path: 'media' },
];

// Custom connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
}));

// Custom step icon
function CustomStepIcon({ icon: Icon, active, completed }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: completed ? 'primary.main' : active ? 'primary.main' : 'grey.200',
        color: completed || active ? '#fff' : 'text.secondary',
        transition: 'all 0.3s ease',
      }}
    >
      {completed ? <CheckCircle fontSize="small" /> : <Icon fontSize="small" />}
    </Box>
  );
}

export default function ProjectStepper() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentStep, editMode, projectId } = useProjectForm();

  // Determine current step from pathname
  const getCurrentStepFromPath = () => {
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const stepIndex = steps.findIndex((s) => s.path === lastPart);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const activeStep = getCurrentStepFromPath();

  const handleStepClick = (index) => {
    const basePath = editMode ? `/admin/projects/edit/${projectId}` : '/admin/projects/add';
    router.push(`${basePath}/${steps[index].path}`);
  };

  if (isMobile) {
    // Mobile: Show only current step
    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            {activeStep + 1}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {steps[activeStep].label}
            </Typography>
          </Box>
        </Box>
        
        {/* Progress bar */}
        <Box sx={{ mt: 2, height: 4, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              bgcolor: 'primary.main',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>
    );
  }

  // Desktop: Full stepper
  return (
    <Box sx={{ mb: 0 }}>
      <Stepper
        activeStep={activeStep}
        connector={<CustomConnector />}
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 3,
        }}
      >
        {steps.map((step, index) => (
          <Step
            key={step.path}
            completed={index < activeStep}
            sx={{ cursor: 'pointer' }}
            onClick={() => handleStepClick(index)}
          >
            <StepLabel
              StepIconComponent={() => (
                <CustomStepIcon
                  icon={step.icon}
                  active={index === activeStep}
                  completed={index < activeStep}
                />
              )}
              sx={{
                '& .MuiStepLabel-label': {
                  // mt: 1,
                  fontWeight: index === activeStep ? 600 : 400,
                  color: index === activeStep ? 'primary.main' : 'text.secondary',
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}