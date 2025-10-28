export const mockEvents = [
  {
    id: 1,
    title: 'Dashain Mela 2025',
    date: '2025-10-30',
    time: '10:00 AM',
    location: 'Tundikhel, Kathmandu',
    description: 'Grand Dashain festival celebration featuring cultural programs, food stalls, and traditional games.',
    organizer: 'Rajesh Shrestha',
    organizerId: 2,
    category: 'Cultural',
    price: 500,
    capacity: 1000,
    registeredCount: 456,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 500, availability: 700, perks: ['General admission', 'Festival grounds access'] },
      { name: 'VIP', price: 1000, availability: 200, perks: ['Priority entry', 'VIP seating', 'Refreshments'] },
      { name: 'VVIP', price: 2000, availability: 100, perks: ['Meet & greet', 'Backstage access', 'Complimentary gifts'] }
    ]
  },
  {
    id: 2,
    title: 'Pokhara Music Festival',
    date: '2025-11-15',
    time: '06:00 PM',
    location: 'Phewa Lake Side, Pokhara',
    description: 'Live music performances by top Nepali artists with stunning lakeside views.',
    organizer: 'Sita Gurung',
    organizerId: 4,
    category: 'Music',
    price: 1500,
    capacity: 500,
    registeredCount: 287,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 1500, availability: 350, perks: ['General admission', 'Lakeside zone'] },
      { name: 'VIP', price: 3000, availability: 100, perks: ['Front row seating', 'VIP lounge', '1 drink coupon'] },
      { name: 'VVIP', price: 5000, availability: 50, perks: ['Backstage access', 'Artist meet & greet', 'Merch pack'] }
    ]
  },
  {
    id: 3,
    title: 'Nepal Tech Summit 2025',
    date: '2025-11-20',
    time: '09:00 AM',
    location: 'Soaltee Hotel, Kathmandu',
    description: 'Connect with tech leaders, startups, and innovators shaping Nepal\'s digital future.',
    organizer: 'Rajesh Shrestha',
    organizerId: 2,
    category: 'Educational',
    price: 2000,
    capacity: 300,
    registeredCount: 245,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 2000, availability: 210, perks: ['Conference access', 'Tea/Coffee'] },
      { name: 'VIP', price: 3500, availability: 60, perks: ['Reserved seating', 'Lunch included', 'VIP lounge'] },
      { name: 'VVIP', price: 6000, availability: 30, perks: ['Speaker dinner', 'Front row', 'Swag kit'] }
    ]
  },
  {
    id: 4,
    title: 'Chitwan Jungle Marathon',
    date: '2025-12-05',
    time: '06:00 AM',
    location: 'Chitwan National Park, Chitwan',
    description: 'Run through the scenic Chitwan National Park in this unique marathon experience.',
    organizer: 'Sita Gurung',
    organizerId: 4,
    category: 'Sports',
    price: 1000,
    capacity: 200,
    registeredCount: 178,
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 1000, availability: 140, perks: ['Participant kit', 'Timing chip'] },
      { name: 'VIP', price: 2000, availability: 40, perks: ['Priority start', 'Recovery lounge'] },
      { name: 'VVIP', price: 3500, availability: 20, perks: ['Helicam footage', 'Meet elite runners'] }
    ]
  },
  {
    id: 5,
    title: 'Buddha Jayanti Celebration',
    date: '2025-05-15',
    time: '07:00 AM',
    location: 'Lumbini, Rupandehi',
    description: 'Sacred celebration of Lord Buddha\'s birth anniversary with prayers, meditation, and cultural programs.',
    organizer: 'Rajesh Shrestha',
    organizerId: 2,
    category: 'Religious',
    price: 0,
    capacity: 2000,
    registeredCount: 1543,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 0, availability: 1400, perks: ['General admission'] },
      { name: 'VIP', price: 0, availability: 400, perks: ['Reserved area'] },
      { name: 'VVIP', price: 0, availability: 200, perks: ['Front row', 'Special blessing'] }
    ]
  },
  {
    id: 6,
    title: 'Kathmandu Art Exhibition',
    date: '2025-11-10',
    time: '11:00 AM',
    location: 'Nepal Art Council, Babar Mahal, Kathmandu',
    description: 'Showcase of contemporary Nepali art featuring paintings, sculptures, and installations.',
    organizer: 'Sita Gurung',
    organizerId: 4,
    category: 'Cultural',
    price: 300,
    capacity: 150,
    registeredCount: 92,
    image: 'https://images.unsplash.com/photo-1577705998148-6da4f3b8e8c6?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 300, availability: 105, perks: ['Gallery access'] },
      { name: 'VIP', price: 600, availability: 30, perks: ['Guided tour', 'Refreshments'] },
      { name: 'VVIP', price: 1200, availability: 15, perks: ['Artist meet', 'Exclusive preview'] }
    ]
  },
  {
    id: 7,
    title: 'Bhaktapur Jatra',
    date: '2025-10-10',
    time: '08:00 AM',
    location: 'Durbar Square, Bhaktapur',
    description: 'Traditional Newari festival with chariot processions, masked dances, and cultural performances.',
    organizer: 'Rajesh Shrestha',
    organizerId: 2,
    category: 'Religious',
    price: 200,
    capacity: 800,
    registeredCount: 800,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    status: 'past',
    ticketTypes: [
      { name: 'Normal', price: 200, availability: 0, perks: ['General admission'] },
      { name: 'VIP', price: 400, availability: 0, perks: ['Reserved area'] },
      { name: 'VVIP', price: 800, availability: 0, perks: ['Front row'] }
    ]
  },
  {
    id: 8,
    title: 'Startup Weekend Kathmandu',
    date: '2025-11-25',
    time: '09:00 AM',
    location: 'Karkhana, Lazimpat, Kathmandu',
    description: '54-hour event where entrepreneurs pitch ideas, form teams, and launch startups.',
    organizer: 'Sita Gurung',
    organizerId: 4,
    category: 'Educational',
    price: 1200,
    capacity: 100,
    registeredCount: 67,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    status: 'upcoming',
    ticketTypes: [
      { name: 'Normal', price: 1200, availability: 70, perks: ['All sessions', 'Snacks'] },
      { name: 'VIP', price: 2400, availability: 20, perks: ['Mentor lounge', 'Lunch included'] },
      { name: 'VVIP', price: 4000, availability: 10, perks: ['1:1 mentor session', 'VIP networking'] }
    ]
  }
];

export const nepalCities = [
  'Kathmandu',
  'Pokhara',
  'Lalitpur',
  'Bhaktapur',
  'Chitwan',
  'Biratnagar',
  'Butwal',
  'Dharan',
  'Hetauda',
  'Janakpur',
  'Bharatpur',
  'Dhangadhi',
  'Nepalgunj',
  'Birgunj',
  'Lumbini'
];

export const eventCategories = [
  'Cultural',
  'Music',
  'Sports',
  'Educational',
  'Religious'
];
