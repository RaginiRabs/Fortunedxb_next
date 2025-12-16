import fs from 'fs';
import path from 'path';

// Base upload directory
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

// Allowed file extensions
const ALLOWED_EXTENSIONS = {
  logo: ['.jpg', '.jpeg', '.png', '.webp'],
  cover: ['.jpg', '.jpeg', '.png', '.webp'],
  award: ['.jpg', '.jpeg', '.png', '.webp'],
  projectlogo: ['.jpg', '.jpeg', '.png', '.webp'],
  gallery: ['.jpg', '.jpeg', '.png', '.webp'],
  floorplan: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  brochure: ['.pdf'],
  // New file types
  taxsheet: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  unitplan: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  paymentplan: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
};

// Max file sizes in MB
const MAX_FILE_SIZES = {
  logo: 2,
  cover: 5,
  award: 2,
  projectlogo: 2,
  gallery: 5,
  floorplan: 5,
  brochure: 10,
  // New file types
  taxsheet: 5,
  unitplan: 5,
  paymentplan: 5,
};

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get file extension
 */
function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Validate file
 */
export function validateFile(file, type) {
  const ext = getExtension(file.name);
  const allowedExts = ALLOWED_EXTENSIONS[type] || ALLOWED_EXTENSIONS.gallery;
  const maxSize = MAX_FILE_SIZES[type] || 5;

  // Check extension
  if (!allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExts.join(', ')}`,
    };
  }

  // Check size (file.size is in bytes)
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSize}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate filename
 * Format: {type}-{entityId}-{timestamp}.{ext}
 */
export function generateFilename(type, entityId, originalFilename) {
  const ext = getExtension(originalFilename);
  const timestamp = Date.now();
  return `${type}-${entityId}-${timestamp}${ext}`;
}

/**
 * Get upload path based on type
 */
export function getUploadPath(type, entityId = null) {
  switch (type) {
    case 'logo':
      return path.join(UPLOAD_BASE_DIR, 'Logo');
    case 'cover':
      return path.join(UPLOAD_BASE_DIR, 'Cover');
    case 'award':
      return path.join(UPLOAD_BASE_DIR, 'Award');
    case 'projectlogo':
      return path.join(UPLOAD_BASE_DIR, 'ProjectLogo');
    case 'gallery':
      return path.join(UPLOAD_BASE_DIR, 'Gallery', `gallery-${entityId}`);
    case 'floorplan':
      return path.join(UPLOAD_BASE_DIR, 'FloorPlan', `floorplan-${entityId}`);
    case 'brochure':
      return path.join(UPLOAD_BASE_DIR, 'Brochure');
    // New file types
    case 'taxsheet':
      return path.join(UPLOAD_BASE_DIR, 'TaxSheet', `taxsheet-${entityId}`);
    case 'unitplan':
      return path.join(UPLOAD_BASE_DIR, 'UnitPlan', `unitplan-${entityId}`);
    case 'paymentplan':
      return path.join(UPLOAD_BASE_DIR, 'PaymentPlan', `paymentplan-${entityId}`);
    default:
      return path.join(UPLOAD_BASE_DIR, 'Other');
  }
}

/**
 * Get folder name for relative path
 */
function getFolderName(type) {
  switch (type) {
    case 'logo':
      return 'Logo';
    case 'cover':
      return 'Cover';
    case 'award':
      return 'Award';
    case 'projectlogo':
      return 'ProjectLogo';
    case 'brochure':
      return 'Brochure';
    case 'taxsheet':
      return 'TaxSheet';
    case 'unitplan':
      return 'UnitPlan';
    case 'paymentplan':
      return 'PaymentPlan';
    default:
      return 'Other';
  }
}

/**
 * Save single file (for logo, cover, award, projectlogo, brochure, gallery, floorplan, etc.)
 * Returns: relative path for database storage
 */
export async function saveSingleFile(file, type, entityId) {
  // Validate file
  const validation = validateFile(file, type);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Get upload directory and ensure it exists
  const uploadDir = getUploadPath(type, entityId);
  ensureDir(uploadDir);

  // Generate filename
  const filename = generateFilename(type, entityId, file.name);
  const filePath = path.join(uploadDir, filename);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(filePath, buffer);

  // Return relative path for database
  // Handle subfolders for multi-file types
  if (type === 'gallery') {
    return `uploads/Gallery/gallery-${entityId}/${filename}`;
  } else if (type === 'floorplan') {
    return `uploads/FloorPlan/floorplan-${entityId}/${filename}`;
  } else if (type === 'taxsheet') {
    return `uploads/TaxSheet/taxsheet-${entityId}/${filename}`;
  } else if (type === 'unitplan') {
    return `uploads/UnitPlan/unitplan-${entityId}/${filename}`;
  } else if (type === 'paymentplan') {
    return `uploads/PaymentPlan/paymentplan-${entityId}/${filename}`;
  }
  
  const folderName = getFolderName(type);
  const relativePath = `uploads/${folderName}/${filename}`;
  return relativePath.replace(/\\/g, '/');
}

/**
 * Save multiple files (for gallery, floorplan, taxsheet, unitplan, paymentplan)
 * Returns: array of relative paths
 */
export async function saveMultipleFiles(files, type, entityId) {
  const savedPaths = [];

  // Get upload directory and ensure it exists
  const uploadDir = getUploadPath(type, entityId);
  ensureDir(uploadDir);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate file
    const validation = validateFile(file, type);
    if (!validation.valid) {
      throw new Error(`File ${file.name}: ${validation.error}`);
    }

    // Generate filename with index for uniqueness
    const ext = getExtension(file.name);
    const timestamp = Date.now();
    const filename = `${type}-${entityId}-${timestamp}-${i}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Build relative path based on type
    let relativePath;
    switch (type) {
      case 'gallery':
        relativePath = `uploads/Gallery/gallery-${entityId}/${filename}`;
        break;
      case 'floorplan':
        relativePath = `uploads/FloorPlan/floorplan-${entityId}/${filename}`;
        break;
      case 'taxsheet':
        relativePath = `uploads/TaxSheet/taxsheet-${entityId}/${filename}`;
        break;
      case 'unitplan':
        relativePath = `uploads/UnitPlan/unitplan-${entityId}/${filename}`;
        break;
      case 'paymentplan':
        relativePath = `uploads/PaymentPlan/paymentplan-${entityId}/${filename}`;
        break;
      default:
        const folderName = getFolderName(type);
        relativePath = `uploads/${folderName}/${filename}`;
    }
    
    savedPaths.push(relativePath);
  }

  return savedPaths;
}

/**
 * Delete single file
 */
export function deleteSingleFile(filePath) {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), 'public', filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

/**
 * Delete multiple files
 */
export function deleteMultipleFiles(filePaths) {
  if (!filePaths || !Array.isArray(filePaths)) return;

  filePaths.forEach((filePath) => {
    deleteSingleFile(filePath);
  });
}

/**
 * Delete entire folder (for gallery/floorplan/taxsheet/unitplan/paymentplan when project is deleted)
 */
export function deleteFolder(type, entityId) {
  const folderPath = getUploadPath(type, entityId);

  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

/**
 * Replace file (delete old, save new)
 */
export async function replaceFile(oldFilePath, newFile, type, entityId) {
  // Delete old file if exists
  if (oldFilePath) {
    deleteSingleFile(oldFilePath);
  }

  // Save new file
  return saveSingleFile(newFile, type, entityId);
}