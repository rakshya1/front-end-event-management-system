// Nepal-specific data and constants
export const NEPAL_PROVINCES = [
  { id: 1, name: 'Koshi Province' },
  { id: 2, name: 'Madhesh Province' },
  { id: 3, name: 'Bagmati Province' },
  { id: 4, name: 'Gandaki Province' },
  { id: 5, name: 'Lumbini Province' },
  { id: 6, name: 'Karnali Province' },
  { id: 7, name: 'Sudurpashchim Province' }
];

export const MAJOR_CITIES = [
  { id: 1, name: 'Kathmandu', province: 'Bagmati' },
  { id: 2, name: 'Pokhara', province: 'Gandaki' },
  { id: 3, name: 'Lalitpur', province: 'Bagmati' },
  { id: 4, name: 'Bhaktapur', province: 'Bagmati' },
  { id: 5, name: 'Biratnagar', province: 'Koshi' },
  { id: 6, name: 'Birgunj', province: 'Madhesh' },
  { id: 7, name: 'Dharan', province: 'Koshi' },
  { id: 8, name: 'Butwal', province: 'Lumbini' },
  { id: 9, name: 'Hetauda', province: 'Bagmati' },
  { id: 10, name: 'Chitwan', province: 'Bagmati' }
];

export const NEPAL_FESTIVALS = [
  { id: 1, name: 'Dashain', season: 'Autumn', description: 'Nepal\'s biggest festival celebrating victory of good over evil' },
  { id: 2, name: 'Tihar', season: 'Autumn', description: 'Festival of lights celebrating various animals and Laxmi' },
  { id: 3, name: 'Holi', season: 'Spring', description: 'Festival of colors welcoming spring' },
  { id: 4, name: 'Buddha Jayanti', season: 'Spring', description: 'Celebration of Lord Buddha\'s birth' },
  { id: 5, name: 'Krishna Janmashtami', season: 'Summer', description: 'Celebration of Lord Krishna\'s birth' },
  { id: 6, name: 'Teej', season: 'Monsoon', description: 'Women\'s festival for marital bliss and family welfare' },
  { id: 7, name: 'Indra Jatra', season: 'Autumn', description: 'Kathmandu\'s most important festival honoring Indra' },
  { id: 8, name: 'Gai Jatra', season: 'Monsoon', description: 'Cow festival commemorating the departed souls' },
  { id: 9, name: 'Maghe Sankranti', season: 'Winter', description: 'Harvest festival marking the end of winter' },
  { id: 10, name: 'Shivaratri', season: 'Winter', description: 'Night of Shiva celebration' }
];

export const EVENT_CATEGORIES = [
  { id: 1, name: 'Cultural Festival', icon: '🎭', description: 'Traditional and cultural celebrations' },
  { id: 2, name: 'Music Concert', icon: '🎵', description: 'Live music performances and concerts' },
  { id: 3, name: 'Business Conference', icon: '💼', description: 'Professional networking and business events' },
  { id: 4, name: 'Educational Seminar', icon: '📚', description: 'Learning workshops and educational talks' },
  { id: 5, name: 'Sports Event', icon: '⚽', description: 'Sports competitions and athletic events' },
  { id: 6, name: 'Art Exhibition', icon: '🎨', description: 'Art shows and creative exhibitions' },
  { id: 7, name: 'Food Festival', icon: '🍽️', description: 'Culinary events and food celebrations' },
  { id: 8, name: 'Religious Ceremony', icon: '🙏', description: 'Spiritual and religious gatherings' },
  { id: 9, name: 'Technology Workshop', icon: '💻', description: 'Tech training and innovation events' },
  { id: 10, name: 'Adventure Activity', icon: '🏔️', description: 'Outdoor adventures and mountain activities' }
];

export const CURRENCY = {
  code: 'NPR',
  symbol: 'Rs.',
  name: 'Nepali Rupee'
};

export const PAYMENT_METHODS = [
  { 
    id: 1, 
    name: 'eSewa', 
    type: 'digital_wallet',
    logo: '/assets/esewa-logo.png',
    description: 'Nepal\'s most popular digital wallet',
    processingFee: 0.02
  },
  { 
    id: 2, 
    name: 'Khalti', 
    type: 'digital_wallet',
    logo: '/assets/khalti-logo.png',
    description: 'Digital payment solution for Nepal',
    processingFee: 0.015
  },
  { 
    id: 3, 
    name: 'IME Pay', 
    type: 'digital_wallet',
    logo: '/assets/imepay-logo.png',
    description: 'Secure mobile payment',
    processingFee: 0.01
  },
  { 
    id: 4, 
    name: 'Bank Transfer', 
    type: 'bank_transfer',
    description: 'Direct bank account transfer',
    processingFee: 0.005
  }
];

export const NEPAL_COLORS = {
  primary: '#DC143C',      // Nepal flag red
  secondary: '#003893',    // Nepal flag blue
  accent: '#FFA500',       // Saffron/Orange
  success: '#228B22',      // Green
  warning: '#FFD700',      // Gold
  background: '#F8F9FA',   // Light background
  text: '#2C3E50'          // Dark text
};

export const BUSINESS_HOURS = {
  weekday: { open: '09:00', close: '18:00' },
  weekend: { open: '10:00', close: '16:00' },
  timezone: 'Asia/Kathmandu'
};

export const POPULAR_VENUES = [
  { id: 1, name: 'Nepal Army Club', city: 'Kathmandu', capacity: 500, type: 'conference' },
  { id: 2, name: 'Hotel Yak & Yeti', city: 'Kathmandu', capacity: 1000, type: 'luxury' },
  { id: 3, name: 'Soaltee Crowne Plaza', city: 'Kathmandu', capacity: 800, type: 'luxury' },
  { id: 4, name: 'Bhrikutimandap', city: 'Kathmandu', capacity: 5000, type: 'exhibition' },
  { id: 5, name: 'Pokhara Stadium', city: 'Pokhara', capacity: 17000, type: 'sports' },
  { id: 6, name: 'Basantapur Durbar Square', city: 'Kathmandu', capacity: 2000, type: 'cultural' },
  { id: 7, name: 'Patan Durbar Square', city: 'Lalitpur', capacity: 1500, type: 'cultural' },
  { id: 8, name: 'City Hall', city: 'Kathmandu', capacity: 300, type: 'official' },
  { id: 9, name: 'Tundikhel', city: 'Kathmandu', capacity: 10000, type: 'outdoor' },
  { id: 10, name: 'Lake Side', city: 'Pokhara', capacity: 3000, type: 'outdoor' }
];