// API Error Codes
export const API_ERRORS = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_LARGE: 413,
  SERVER_ERROR: 500,
};

// File Upload Config
export const FILE_CONFIG = {
  LOGO: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    folder: 'Logo',
  },
  GALLERY: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    folder: 'Gallery',
  },
  FLOORPLAN: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
    folder: 'Floorplan',
  },
  BROCHURE: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['application/pdf'],
    folder: 'Brochure',
  },
};

// Usage Type Options
export const USAGE_TYPE_OPTIONS = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Both', label: 'Both' },
];

// Project Status Options
export const PROJECT_STATUS_OPTIONS = [
  { value: 'New Launch', label: 'New Launch' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Ready', label: 'Ready' },
];

// Furnishing Status Options
export const FURNISHING_OPTIONS = [
  { value: 'Unfurnished', label: 'Unfurnished' },
  { value: 'Semi-Furnished', label: 'Semi-Furnished' },
  { value: 'Furnished', label: 'Furnished' },
];

// Lead Source Options
export const LEAD_SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Phone Call', label: 'Phone Call' },
  { value: 'Walk-in', label: 'Walk-in' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Property Portal', label: 'Property Portal' },
  { value: 'Other', label: 'Other' },
];

// User Role Options
export const USER_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'agent', label: 'Agent' },
];

// Project Type Options
export const PROJECT_TYPE_OPTIONS = [
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Duplex', label: 'Duplex' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Office', label: 'Office' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Mixed Use', label: 'Mixed Use' },
];

// Nearby Category Options
export const NEARBY_CATEGORY_OPTIONS = [
  { value: 'Education', label: 'Education' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Beach', label: 'Beach' },
  { value: 'Airport', label: 'Airport' },
  { value: 'Business', label: 'Business' },
];