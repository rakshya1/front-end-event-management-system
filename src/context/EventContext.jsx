import { createContext, useContext, useEffect, useState } from 'react';
import { mockEvents } from '../data/mockEvents';
import { mockAttendees } from '../data/mockAttendees';
import { api } from '../services/api';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(mockEvents);
  const [attendees, setAttendees] = useState(mockAttendees);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch events from backend if available
  useEffect(() => {
    const load = async () => {
      setLoadingEvents(true);
      try {
        const data = await api.get('/events');
        if (Array.isArray(data) && data.length) {
          setEvents(data.map(mapBackendEvent));
        }
      } catch (e) {
        // silent fallback to mocks
        console.warn('Using mock events. Backend fetch failed:', e?.message);
      } finally {
        setLoadingEvents(false);
      }
    };
    load();
  }, []);

  const getEventById = (id) => {
    const local = events.find(event => event.id === parseInt(id));
    return local;
  };

  const fetchEventById = async (id) => {
    try {
      const data = await api.get(`/events/${id}`);
      return mapBackendEvent(data);
    } catch (e) {
      console.warn('Failed to fetch event by id', e?.message);
      return null;
    }
  };

  const getEventsByOrganizer = (organizerId) => {
    return events.filter(event => event.organizerId === organizerId);
  };

  const createEvent = (eventData, organizerId, organizerName) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1,
      organizerId,
      organizer: organizerName,
      registeredCount: 0,
      status: 'upcoming'
    };
    setEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, eventData) => {
    setEvents(events.map(event => event.id === id ? { ...event, ...eventData } : event));
    // Try backend update; ignore errors for now
    api.put(`/events/${id}`, eventData).catch(()=>{});
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    setAttendees(attendees.filter(attendee => attendee.eventId !== id));
  };

  const registerForEvent = (eventId, userId, userName, userEmail) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, error: 'Event not found' };

    // Check if already registered
    const alreadyRegistered = attendees.some(
      a => a.eventId === eventId && a.userId === userId
    );
    if (alreadyRegistered) {
      return { success: false, error: 'Already registered for this event' };
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return { success: false, error: 'Event is full' };
    }

    const newAttendee = {
      id: attendees.length + 1,
      userId,
      name: userName,
      email: userEmail,
      eventId,
      eventTitle: event.title,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };

    setAttendees([...attendees, newAttendee]);
    setEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, registeredCount: e.registeredCount + 1 }
        : e
    ));

    return { success: true, attendee: newAttendee };
  };

  const unregisterFromEvent = (eventId, userId) => {
    setAttendees(attendees.filter(
      a => !(a.eventId === eventId && a.userId === userId)
    ));
    setEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) }
        : e
    ));
  };

  const getAttendeesByEvent = (eventId) => {
    return attendees.filter(a => a.eventId === eventId);
  };

  const getAttendeesByUser = (userId) => {
    return attendees.filter(a => a.userId === userId);
  };

  const getAllAttendees = () => {
    return attendees;
  };

  const isUserRegistered = (eventId, userId) => {
    return attendees.some(a => a.eventId === eventId && a.userId === userId);
  };

  const value = {
    events,
    attendees,
    loadingEvents,
    getEventById,
    fetchEventById,
    getEventsByOrganizer,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getAttendeesByEvent,
    getAttendeesByUser,
    getAllAttendees,
    isUserRegistered
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
