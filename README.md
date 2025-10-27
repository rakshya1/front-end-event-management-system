# Event Management System Frontend

A complete event management system built with **React**, **React Router v6**, **Tailwind CSS**, and the **Context API** for state management. This application features role-based access control with three user types: **Attendee**, **Organizer**, and **Admin**.

## Features

### Role-Based Access Control
- **Attendee**: Browse events, view details, register for events
- **Organizer**: All attendee features + create events + manage attendees for their events
- **Admin**: Dashboard access, view all attendees, browse/register for events (cannot create events)

### Pages & Routes
- **Public**: Home (`/`), Events (`/events`), Event Details (`/events/:id`), Login (`/login`), Signup (`/signup`)
- **Organizer-Only**: Create Event (`/create`)
- **Admin-Only**: Dashboard (`/dashboard`)
- **Admin & Organizer**: Attendees Management (`/attendees`)

### Key Functionality
- Authentication with persistent sessions (localStorage)
- Dynamic navigation based on user role
- Event registration with capacity tracking
- Event creation and management
- Admin dashboard with statistics
- Attendee management with filtering
- Responsive design with Tailwind CSS
- Protected routes with automatic redirects

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - Global state management (Auth & Events)
- **Vite** - Build tool and dev server
- **Mock Data** - In-memory data simulation

## Project Structure

```
event-management-frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx       # Role-based navigation bar
│   │   ├── Footer.jsx           # Global footer
│   │   └── ProtectedRoute.jsx   # Route protection component
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication & user management
│   │   └── EventContext.jsx     # Event & attendee management
│   ├── data/
│   │   ├── mockUsers.js         # Mock user data
│   │   ├── mockEvents.js        # Mock event data
│   │   └── mockAttendees.js     # Mock attendee data
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Events.jsx           # Events list with filtering
│   │   ├── EventDetails.jsx     # Event details & registration
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── CreateEvent.jsx      # Event creation (organizer-only)
│   │   ├── Dashboard.jsx        # Admin dashboard
│   │   └── Attendees.jsx        # Attendees management
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── TESTING_GUIDE.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Test Accounts

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Attendee  | attendee@example.com     | password123 |
| Organizer | organizer@example.com    | password123 |
| Admin     | admin@example.com        | password123 |

See `TESTING_GUIDE.md` for detailed testing instructions.

## Design Decisions

### State Management
- **Context API** over Redux for simpler setup and smaller bundle size
- **AuthContext** manages authentication state and user sessions
- **EventContext** handles all event and attendee operations

### Routing
- **React Router v6** with declarative routing
- **ProtectedRoute** component wraps restricted routes
- Role-based redirects prevent unauthorized access

### Styling
- **Tailwind CSS** for rapid UI development
- **Blue-gray color palette** as per requirements
- **Responsive design** using Tailwind's responsive utilities
- **Hover effects and transitions** for better UX

### Mock Data
- In-memory data simulation (no backend required)
- LocalStorage for session persistence
- Easy to replace with actual API calls

## Extending the Application

### Adding Backend Integration

Replace mock data operations in contexts with API calls:

```javascript
// Example: Update createEvent in EventContext
const createEvent = async (eventData, organizerId, organizerName) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...eventData, organizerId, organizer: organizerName })
  });
  const newEvent = await response.json();
  setEvents([...events, newEvent]);
  return newEvent;
};
```

### Adding New Roles

1. Update `mockUsers.js` with new role
2. Modify `AuthContext` role validation
3. Update `Navigation.jsx` to show role-specific links
4. Add protected routes in `App.jsx`

### Adding More Features

- Event editing/deletion for organizers
- Event search and advanced filtering
- User profiles and settings
- Email notifications
- Calendar integration
- Payment processing for paid events

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Author

Built with ❤️ using React, Tailwind CSS, and React Router v6.
