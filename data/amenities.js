export const AMENITIES = [
  'Swimming Pool',
  'Gym & Fitness Center',
  'Spa & Wellness',
  'Kids Play Area',
  'Tennis Court',
  'Basketball Court',
  'Squash Court',
  'Yoga Studio',
  'Jogging Track',
  'Cycling Track',
  'Parking',
  'Covered Parking',
  'Valet Parking',
  'Beach Access',
  'Private Beach',
  'Marina',
  'Security 24/7',
  'CCTV Surveillance',
  'Concierge Service',
  'Reception & Lobby',
  'Landscaped Gardens',
  'Rooftop Garden',
  'BBQ Area',
  'Outdoor Lounge',
  'Retail Outlets',
  'Restaurants & Cafes',
  'Supermarket',
  'Business Center',
  'Meeting Rooms',
  'Co-working Space',
  'Cinema Room',
  'Game Room',
  'Library',
  'Sauna & Steam',
  'Jacuzzi',
  'Pet Friendly',
  'Pet Park',
  'Smart Home',
  'High-Speed Elevators',
  'Prayer Room',
  'Maid Service',
  'Maintenance Service',
  'Infinity Pool',
  'Kids Pool',
  'Outdoor Gym',
  'Golf Course',
  'Helipad',
  'EV Charging',
];

export const AMENITY_CATEGORIES = {
  'Recreation': ['Swimming Pool', 'Infinity Pool', 'Kids Pool', 'Tennis Court', 'Basketball Court', 'Squash Court', 'Golf Course'],
  'Fitness': ['Gym & Fitness Center', 'Yoga Studio', 'Jogging Track', 'Cycling Track', 'Outdoor Gym'],
  'Wellness': ['Spa & Wellness', 'Sauna & Steam', 'Jacuzzi'],
  'Security': ['Security 24/7', 'CCTV Surveillance', 'Concierge Service'],
  'Parking': ['Parking', 'Covered Parking', 'Valet Parking', 'EV Charging'],
  'Lifestyle': ['Beach Access', 'Private Beach', 'Marina', 'Helipad'],
  'Community': ['Landscaped Gardens', 'Rooftop Garden', 'BBQ Area', 'Outdoor Lounge', 'Kids Play Area', 'Pet Park'],
  'Commercial': ['Retail Outlets', 'Restaurants & Cafes', 'Supermarket'],
  'Business': ['Business Center', 'Meeting Rooms', 'Co-working Space'],
  'Entertainment': ['Cinema Room', 'Game Room', 'Library'],
  'Services': ['Reception & Lobby', 'Maid Service', 'Maintenance Service', 'Smart Home', 'High-Speed Elevators', 'Prayer Room', 'Pet Friendly'],
};

// Get all amenities as a flat searchable list
export const getAllAmenities = () => {
  return AMENITIES;
};

// Search amenities
export const searchAmenities = (query) => {
  if (!query) return AMENITIES;
  const lowerQuery = query.toLowerCase();
  return AMENITIES.filter(amenity => 
    amenity.toLowerCase().includes(lowerQuery)
  );
};

// Get category for an amenity
export const getAmenityCategory = (amenity) => {
  for (const [category, amenities] of Object.entries(AMENITY_CATEGORIES)) {
    if (amenities.includes(amenity)) {
      return category;
    }
  }
  return 'Custom';
};