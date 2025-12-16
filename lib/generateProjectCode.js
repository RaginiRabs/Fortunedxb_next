import { getCityCode, getDeveloperInitials } from '@/data/cityCodes';

/**
 * Generate Project Code
 * Format: {CITY_CODE}-{DEVELOPER_INITIALS}{YEAR}{SEQUENCE}
 * Example: DXB-EMR2025001
 * 
 * @param {string} cityName - City name (e.g., "Dubai")
 * @param {string} developerName - Developer name (e.g., "Emaar Properties")
 * @param {number} sequence - Sequence number from database
 * @param {number} year - Year (optional, defaults to current year)
 * @returns {string} Generated project code
 */
export const generateProjectCode = (cityName, developerName, sequence, year = null) => {
  const cityCode = getCityCode(cityName);
  const devInitials = getDeveloperInitials(developerName);
  const projectYear = year || new Date().getFullYear();
  const sequenceStr = String(sequence).padStart(3, '0');
  
  return `${cityCode}-${devInitials}${projectYear}${sequenceStr}`;
};

/**
 * Parse existing project code
 * @param {string} projectCode - Project code to parse
 * @returns {object} Parsed components
 */
export const parseProjectCode = (projectCode) => {
  if (!projectCode) return null;
  
  const match = projectCode.match(/^([A-Z]{3})-([A-Z]{2,3})(\d{4})(\d{3})$/);
  
  if (!match) return null;
  
  return {
    cityCode: match[1],
    developerInitials: match[2],
    year: parseInt(match[3]),
    sequence: parseInt(match[4]),
  };
};

/**
 * Validate project code format
 * @param {string} projectCode - Project code to validate
 * @returns {boolean} Is valid
 */
export const isValidProjectCode = (projectCode) => {
  if (!projectCode) return false;
  const pattern = /^[A-Z]{3}-[A-Z]{2,3}\d{4}\d{3}$/;
  return pattern.test(projectCode);
};

export default generateProjectCode;