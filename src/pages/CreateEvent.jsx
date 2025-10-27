import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { MAJOR_CITIES, EVENT_CATEGORIES, POPULAR_VENUES } from '../data/nepalData';

const CreateEvent = () => {
  const { user } = useAuth();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    city: 'Kathmandu',
    province: 'Bagmati',
    venue: '',
    description: '',
    category: EVENT_CATEGORIES[0]?.name || 'Cultural Festival',
    capacity: 100,
    price: 0,
    currency: 'NPR',
    image: '',
    requiresApproval: false,
    ageRestriction: 'All Ages',
    tags: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('upload'); // 'upload' or 'url'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (name === 'capacity' || name === 'price') {
      processedValue = parseInt(value) || 0;
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData({ ...formData, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Process tags
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const eventData = {
        ...formData,
        tags: processedTags,
        organizer: user.name,
        organizerId: user.id,
        registeredCount: 0,
        status: 'upcoming',
        image: formData.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&q=80`
      };
      
      const newEvent = createEvent(eventData, user.id, user.name);
      
      // Show success message
      alert('🎉 Event created successfully! Your event is now live and accepting registrations.');
      
      // Redirect to the new event
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(0, 0%, 100%)' }}>
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-orange-500 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎆 Create Your Event
          </h1>
          <p className="text-xl text-white/90">
            Bring your vision to life and connect with Nepal's vibrant community
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Event Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>📝 Event Details</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Nepal Tech Summit 2025"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ 
                    border: '2px solid hsl(240, 10%, 90%)',
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    color: 'hsl(222.2, 84%, 4.9%)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    📅 Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    ⏰ Start Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    ⏱️ End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>📍 Location & Venue</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    🏙️ City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                    required
                  >
                    {MAJOR_CITIES.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="venue" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    🏢 Venue
                  </label>
                  <select
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  >
                    <option value="">Select a venue (optional)</option>
                    {POPULAR_VENUES.filter(venue => venue.city === formData.city).map(venue => (
                      <option key={venue.id} value={venue.name}>
                        {venue.name} (Capacity: {venue.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                  📍 Full Address *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Hotel Yak & Yeti, Durbar Marg, Kathmandu"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ 
                    border: '2px solid hsl(240, 10%, 90%)',
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    color: 'hsl(222.2, 84%, 4.9%)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  required
                />
              </div>
            </div>

            {/* Event Category and Pricing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>🎪 Category & Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    🏷️ Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                    required
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    💰 Ticket Price (NPR)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    placeholder="0 for free events"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    👥 Capacity *
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    placeholder="Maximum attendees"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="ageRestriction" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                    🔞 Age Restriction
                  </label>
                  <select
                    id="ageRestriction"
                    name="ageRestriction"
                    value={formData.ageRestriction}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  >
                    <option value="All Ages">All Ages</option>
                    <option value="12+">12+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                    <option value="21+">21+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>📖 Event Description</h2>
              
              <div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe your event in detail. What makes it special? What can attendees expect?"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 resize-none"
                  style={{ 
                    border: '2px solid hsl(240, 10%, 90%)',
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    color: 'hsl(222.2, 84%, 4.9%)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-semibold mb-3" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                  🏷️ Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., technology, networking, startup, innovation"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                  style={{ 
                    border: '2px solid hsl(240, 10%, 90%)',
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    color: 'hsl(222.2, 84%, 4.9%)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                  onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>📸 Event Image</h2>
              
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('upload')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    uploadMethod === 'upload' 
                      ? 'text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={uploadMethod === 'upload' ? {
                    background: 'linear-gradient(135deg, hsl(270, 95%, 75%) 0%, hsl(315, 85%, 70%) 100%)'
                  } : {}}
                >
                  📤 Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    uploadMethod === 'url' 
                      ? 'text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={uploadMethod === 'url' ? {
                    background: 'linear-gradient(135deg, hsl(270, 95%, 75%) 0%, hsl(315, 85%, 70%) 100%)'
                  } : {}}
                >
                  🔗 Image URL
                </button>
              </div>

              {uploadMethod === 'upload' ? (
                <div>
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'hsl(240, 10%, 90%)' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-4">📷</div>
                        <p className="text-lg font-medium mb-2" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                          Click to upload an image
                        </p>
                        <p className="text-sm" style={{ color: 'hsl(215.4, 16.3%, 46.9%)' }}>
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ 
                      border: '2px solid hsl(240, 10%, 90%)',
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      color: 'hsl(222.2, 84%, 4.9%)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'hsl(270, 95%, 75%)'}
                    onBlur={(e) => e.target.style.borderColor = 'hsl(240, 10%, 90%)'}
                  />
                  {imagePreview && (
                    <div className="mt-4 relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>⚙️ Event Settings</h2>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  name="requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: 'hsl(270, 95%, 75%)' }}
                />
                <label htmlFor="requiresApproval" className="font-medium" style={{ color: 'hsl(222.2, 84%, 4.9%)' }}>
                  ✅ Require approval for registration
                </label>
              </div>
              
              <p className="text-sm" style={{ color: 'hsl(215.4, 16.3%, 46.9%)' }}>
                Enable this if you want to manually approve each registration before confirming attendance.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-lg font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: isSubmitting 
                    ? 'hsl(240, 10%, 50%)' 
                    : 'linear-gradient(135deg, hsl(270, 95%, 75%) 0%, hsl(315, 85%, 70%) 50%, hsl(45, 100%, 70%) 100%)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </span>
                ) : (
                  <span>🎆 Create Event</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: 'hsl(240, 10%, 96%)',
                  color: 'hsl(222.2, 84%, 4.9%)',
                  border: '2px solid hsl(240, 10%, 90%)'
                }}
              >
                ❌ Cancel
              </button>
            </div>

            {/* Success Message */}
            <div className="text-center text-sm" style={{ color: 'hsl(215.4, 16.3%, 46.9%)' }}>
              ✨ Once created, your event will be immediately available for registration
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
