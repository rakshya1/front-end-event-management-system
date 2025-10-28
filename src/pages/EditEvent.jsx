import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { eventCategories } from '../data/mockEvents';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEventById, updateEvent } = useEvents();

  const existing = getEventById(id);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || '',
        date: existing.date || '',
        time: existing.time || '',
        location: existing.location || '',
        description: existing.description || '',
        category: existing.category || eventCategories[0],
        capacity: existing.capacity || 0,
        price: existing.price || 0,
        image: existing.image || ''
      });
    }
  }, [existing]);

  if (!existing) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Event not found</h2>
          <button onClick={() => navigate('/events')} className="text-blue-600">Back to Events</button>
        </div>
      </div>
    );
  }

  // Only the event organizer can edit
  const isOwner = user && user.role === 'organizer' && user.id === existing.organizerId;
  if (!isOwner) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="mb-4">You are not authorized to edit this event.</p>
          <button onClick={() => navigate(`/events/${existing.id}`)} className="px-6 py-2 bg-blue-600 text-white rounded">Go Back</button>
        </div>
      </div>
    );
  }

  const set = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    updateEvent(existing.id, form);
    alert('Event updated successfully');
    navigate(`/events/${existing.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Event</h1>
        <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Title</label>
            <input value={form?.title||''} onChange={(e)=>set({title:e.target.value})} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Date</label>
              <input type="date" value={form?.date||''} onChange={(e)=>set({date:e.target.value})} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Time</label>
              <input type="time" value={form?.time||''} onChange={(e)=>set({time:e.target.value})} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Location</label>
            <input value={form?.location||''} onChange={(e)=>set({location:e.target.value})} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Category</label>
            <select value={form?.category||''} onChange={(e)=>set({category:e.target.value})} className="w-full border rounded px-3 py-2">
              {eventCategories.map((c)=> (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Capacity</label>
              <input type="number" min="1" value={form?.capacity||0} onChange={(e)=>set({capacity:parseInt(e.target.value)||0})} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Price (NPR)</label>
              <input type="number" min="0" value={form?.price||0} onChange={(e)=>set({price:parseInt(e.target.value)||0})} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Image URL</label>
            <input value={form?.image||''} onChange={(e)=>set({image:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Description</label>
            <textarea value={form?.description||''} onChange={(e)=>set({description:e.target.value})} rows="5" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={()=>navigate(-1)} className="px-4 py-2 bg-slate-200 rounded mr-2">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;