# Testing Guide

## Test Accounts

Use these credentials to test different user roles:

### Attendee Account
- **Email:** attendee@example.com
- **Password:** password123
- **Access:** Browse events, view details, register for events

### Organizer Account
- **Email:** organizer@example.com
- **Password:** password123
- **Access:** Everything attendees can do + Create events + View attendees for their events

### Admin Account
- **Email:** admin@example.com
- **Password:** password123
- **Access:** Dashboard, View all attendees, Browse and register for events (cannot create events)

## Testing Role-Based Access

### Public Pages (No login required)
- **/** - Home page
- **/events** - Browse all events
- **/events/:id** - View event details
- **/login** - Login page
- **/signup** - Signup page

### Organizer-Only Pages
- **/create** - Create new events (only organizers can access)

### Admin-Only Pages
- **/dashboard** - Admin dashboard with statistics

### Admin & Organizer Pages
- **/attendees** - View attendees (admins see all, organizers see only their events)

## Feature Testing

### As Attendee
1. Login with attendee@example.com
2. Browse events on /events page
3. Click on an event to view details
4. Register for an event
5. Try to access /create (should redirect to home)
6. Try to access /dashboard (should redirect to home)

### As Organizer
1. Login with organizer@example.com
2. Browse events
3. Click "Create Event" in navigation
4. Fill out the form and create a new event
5. Go to "My Attendees" to see attendees for your events
6. Try to access /dashboard (should redirect to home)

### As Admin
1. Login with admin@example.com
2. Access Dashboard from navigation
3. View statistics and event overview
4. Go to "Attendees" to see all attendees
5. Filter attendees by event
6. Try to access /create (should redirect to home)

### Navigation Changes by Role
- **Not logged in:** Home, Events, Login, Sign Up
- **Attendee:** Home, Events, [User name with role], Logout
- **Organizer:** Home, Events, Create Event, My Attendees, [User name with role], Logout
- **Admin:** Home, Events, Dashboard, Attendees, [User name with role], Logout

## Expected Behaviors

### Protected Routes
- Accessing protected routes without login redirects to /login
- Accessing routes without proper role redirects to home page (/)

### Registration
- Users can only register once per event
- Events at full capacity show "Event Full" button (disabled)
- Registered users see "Unregister" button instead

### Event Creation
- Only organizers can create events
- New events appear immediately in the events list
- Created events show the organizer's name
