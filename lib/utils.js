// Create URL-friendly slugs
export const createSlug = (text) => {
  return text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || '';
};

// Create slug from project name + ID
// Example: "Shahrukh'z by Danube", 1501 → "shahrukhz-by-danube-1501"
export function createProjectSlug(name, id) {
  const slug = name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Multiple hyphens to single
    .replace(/(^-|-$)/g, '')       // Remove leading/trailing hyphens
    .trim() || 'project';
  
  return `${slug}-${id}`;
}

// Create developer slug
// Example: "Danube Properties" → "danube-properties"
export function createDeveloperSlug(name) {
  return name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim() || 'developer';
}

// Extract ID from project slug
// Example: "shahrukhz-by-danube-1501" → 1501
export function extractIdFromSlug(slug) {
  if (!slug) return null;
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1]);
  return isNaN(id) ? null : id;
}

// Format price - converts number to K/M format
export const formatPrice = (value) => {
  if (!value) return 'Price on Request';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
};

// Get status style
export const getStatusStyle = (status) => {
  const s = status?.toLowerCase() || '';
  if (s.includes('hot')) return { bg: '#C6A962', text: '#FFFFFF' };
  if (s.includes('new') || s.includes('launch') || s.includes('off-plan')) return { bg: '#0B1A2A', text: '#FFFFFF' };
  if (s.includes('upcoming')) return { bg: '#64748B', text: '#FFFFFF' };
  if (s.includes('ready')) return { bg: '#10B981', text: '#FFFFFF' };
  if (s.includes('under') || s.includes('construction')) return { bg: '#F59E0B', text: '#FFFFFF' };
  return { bg: '#64748B', text: '#FFFFFF' };
};

// ==========================================
// CONFIGURATION HELPER FUNCTIONS
// ==========================================

/**
 * Get lowest price from configurations
 * @param {Array} configurations - Array of configuration objects
 * @returns {number|null} - Lowest price_min value
 */
export const getLowestPrice = (configurations) => {
  if (!configurations || configurations.length === 0) return null;
  
  const prices = configurations
    .map(c => parseFloat(c.price_min))
    .filter(p => !isNaN(p) && p > 0);
  
  return prices.length > 0 ? Math.min(...prices) : null;
};

/**
 * Get highest price from configurations
 * @param {Array} configurations - Array of configuration objects
 * @returns {number|null} - Highest price_max value
 */
export const getHighestPrice = (configurations) => {
  if (!configurations || configurations.length === 0) return null;
  
  const prices = configurations
    .map(c => parseFloat(c.price_max))
    .filter(p => !isNaN(p) && p > 0);
  
  return prices.length > 0 ? Math.max(...prices) : null;
};

/**
 * Get unique unit types from configurations
 * @param {Array} configurations - Array of configuration objects
 * @returns {string} - Comma separated types like "Studio, 1 BHK, 2 BHK"
 */
export const getUnitTypes = (configurations) => {
  if (!configurations || configurations.length === 0) return '-';
  
  const types = configurations
    .map(c => c.type)
    .filter(t => t && t.trim() !== '');
  
  // Get unique types while preserving order
  const uniqueTypes = [...new Set(types)];
  
  return uniqueTypes.length > 0 ? uniqueTypes.join(', ') : '-';
};

/**
 * Get area range from all configurations
 * @param {Array} configurations - Array of configuration objects
 * @returns {string} - Area range like "450 - 1200" or "450"
 */
export const getAreaRange = (configurations) => {
  if (!configurations || configurations.length === 0) return '-';
  
  const minAreas = configurations
    .map(c => parseFloat(c.area_min))
    .filter(a => !isNaN(a) && a > 0);
  
  const maxAreas = configurations
    .map(c => parseFloat(c.area_max))
    .filter(a => !isNaN(a) && a > 0);
  
  if (minAreas.length === 0 && maxAreas.length === 0) return '-';
  
  const overallMin = minAreas.length > 0 ? Math.min(...minAreas) : null;
  const overallMax = maxAreas.length > 0 ? Math.max(...maxAreas) : null;
  
  if (overallMin && overallMax && overallMin !== overallMax) {
    return `${overallMin} - ${overallMax}`;
  }
  
  return `${overallMin || overallMax}`;
};

/**
 * Format config area - returns area string with unit
 * @param {Object} config - Single configuration object
 * @returns {string} - "450 Sq.Ft" or "450 - 650 Sq.Ft"
 */
export const formatConfigArea = (config) => {
  if (!config) return '-';
  
  const unit = config.area_unit || 'Sq.Ft';
  const min = parseFloat(config.area_min);
  const max = parseFloat(config.area_max);
  
  if (isNaN(min) && isNaN(max)) return '-';
  
  // If is_range is true and min !== max, show range
  if (config.is_range && !isNaN(min) && !isNaN(max) && min !== max) {
    return `${min} - ${max} ${unit}`;
  }
  
  // Otherwise show single value
  return `${min || max} ${unit}`;
};

/**
 * Format config price - returns price string with currency
 * @param {Object} config - Single configuration object
 * @returns {string} - "AED 850K" or "AED 850K - 1.2M" or null if no price
 */
export const formatConfigPrice = (config) => {
  if (!config) return null;
  
  const currency = config.currency || 'AED';
  const min = parseFloat(config.price_min);
  const max = parseFloat(config.price_max);
  
  if (isNaN(min) && isNaN(max)) return null;
  
  // If is_range is true and min !== max, show range
  if (config.is_range && !isNaN(min) && !isNaN(max) && min !== max) {
    return `${currency} ${formatPrice(min)} - ${formatPrice(max)}`;
  }
  
  // Otherwise show single value
  const price = min || max;
  return `${currency} ${formatPrice(price)}`;
};

/**
 * Check if config has price
 * @param {Object} config - Single configuration object
 * @returns {boolean}
 */
export const configHasPrice = (config) => {
  if (!config) return false;
  const min = parseFloat(config.price_min);
  const max = parseFloat(config.price_max);
  return (!isNaN(min) && min > 0) || (!isNaN(max) && max > 0);
};

/**
 * Get image layout type based on image count
 * @param {number} count - Number of images
 * @returns {string} - Layout type: 'single', 'two', 'three', 'four', 'five-plus'
 */
export const getImageLayout = (count) => {
  if (count <= 1) return 'single';
  if (count === 2) return 'two';
  if (count === 3) return 'three';
  if (count === 4) return 'four';
  return 'five-plus';
};