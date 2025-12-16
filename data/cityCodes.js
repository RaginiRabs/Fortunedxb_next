// City codes for project code generation
// Format: {CITY_CODE}-{DEVELOPER_INITIALS}{YEAR}{SEQUENCE}
// Example: DXB-EMR2025001

export const CITY_CODES = {
  // UAE Cities
  'Dubai': 'DXB',
  'Abu Dhabi': 'AUH',
  'Sharjah': 'SHJ',
  'Ajman': 'AJM',
  'Ras Al Khaimah': 'RAK',
  'Fujairah': 'FUJ',
  'Umm Al Quwain': 'UAQ',
  
  // Add more cities as needed
  'Al Ain': 'AAN',
  'Khor Fakkan': 'KFK',
};

// Get city code from city name
export const getCityCode = (cityName) => {
  if (!cityName) return 'XXX';
  return CITY_CODES[cityName] || cityName.substring(0, 3).toUpperCase();
};

// Get developer initials from name
export const getDeveloperInitials = (developerName) => {
  if (!developerName) return 'XXX';
  
  // Split by space and take first letter of each word (max 3)
  const words = developerName.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word - take first 3 letters
    return words[0].substring(0, 3).toUpperCase();
  }
  
  // Multiple words - take first letter of first 3 words
  return words
    .slice(0, 3)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

// City options for dropdown (if needed)
export const CITY_OPTIONS = Object.keys(CITY_CODES).map(city => ({
  label: city,
  value: city,
  code: CITY_CODES[city],
}));

export default CITY_CODES;