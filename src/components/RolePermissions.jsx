import React from 'react';
import { useAuth } from '../context/AuthContext';

const RolePermissions = () => {
  const { user } = useAuth();

  const rolePermissions = {
    admin: {
      title: "🛡️ System Administrator",
      permissions: [
        "📊 View complete system analytics",
        "👥 Manage all users and verify organizers",
        "🎉 Moderate and approve/reject events",
        "💰 Access financial reports and payment disputes",
        "⚙️ System configuration and settings",
        "🚫 Ban or suspend users",
        "📈 Export data and generate reports"
      ],
      paymentAccess: "❌ Admins cannot register or pay for events",
      color: "red"
    },
    organizer: {
      title: "🎪 Event Organizer",
      permissions: [
        "🎯 Create and manage your own events",
        "📝 Edit event details, pricing, and capacity",
        "📊 View attendee list and registration analytics",
        "📧 Send notifications to registered attendees",
        "💬 Respond to attendee inquiries",
        "📈 Export attendee data for your events",
        "🎫 Generate event reports and statistics"
      ],
      paymentAccess: "❌ Organizers cannot register or pay for events",
      color: "blue"
    },
    attendee: {
      title: "🎫 Event Attendee",
      permissions: [
        "🔍 Browse and search all available events",
        "👀 View detailed event information",
        "💳 Register and pay for events (eSewa, Khalti, IME Pay)",
        "📱 Receive event notifications and updates",
        "📋 View personal booking history",
        "❌ Cancel event registrations",
        "⭐ Leave reviews and feedback"
      ],
      paymentAccess: "✅ Only attendees can register and pay for events",
      color: "green"
    },
    guest: {
      title: "👁️ Guest User",
      permissions: [
        "👀 View public event information",
        "🔍 Browse event listings (read-only)",
        "📅 Check event dates and locations",
        "💡 See event categories and organizers"
      ],
      paymentAccess: "❌ Guests must register as attendee to pay for events",
      color: "gray"
    }
  };

  if (!user) return null;

  const currentRole = rolePermissions[user.role] || rolePermissions.guest;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Access Level</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          currentRole.color === 'red' ? 'bg-red-100 text-red-700' :
          currentRole.color === 'blue' ? 'bg-blue-100 text-blue-700' :
          currentRole.color === 'green' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {user.role.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{currentRole.title}</h3>
        <p className={`text-sm font-medium mb-3 ${
          currentRole.paymentAccess.includes('✅') ? 'text-green-600' : 'text-red-600'
        }`}>
          {currentRole.paymentAccess}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700 mb-2">What you can do:</h4>
        {currentRole.permissions.map((permission, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span className="text-sm text-gray-700">{permission}</span>
          </div>
        ))}
      </div>

      {user.role !== 'attendee' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <span className="font-semibold">💡 Need to register for events?</span> 
            <br />
            Only users with "attendee" role can register and pay for events. 
            Contact an admin if you need your role changed.
          </p>
        </div>
      )}
    </div>
  );
};

export default RolePermissions;