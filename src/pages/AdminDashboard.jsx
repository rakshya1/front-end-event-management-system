import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockEvents } from '../data/nepalMockEvents';
import { mockUsers, hasPermission } from '../data/mockUsers';
import { NEPAL_PROVINCES, EVENT_CATEGORIES, CURRENCY, PAYMENT_METHODS } from '../data/nepalData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this dashboard.</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate comprehensive admin statistics
  const adminStats = useMemo(() => {
    const events = mockEvents;
    const users = mockUsers;
    
    // Financial metrics
    const totalRevenue = events.reduce((sum, event) => sum + (event.registeredCount * event.price), 0);
    const totalRegistrations = events.reduce((sum, event) => sum + event.registeredCount, 0);
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const avgTicketPrice = totalRevenue / totalRegistrations || 0;
    
    // User analytics
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    const verifiedOrganizers = users.filter(u => u.role === 'organizer' && u.verified).length;
    const unverifiedOrganizers = users.filter(u => u.role === 'organizer' && !u.verified).length;
    
    // Province-wise breakdown
    const provinceStats = NEPAL_PROVINCES.reduce((acc, province) => {
      const provinceEvents = events.filter(e => e.province === province.name);
      const provinceUsers = users.filter(u => u.province === province.name);
      
      acc[province.name] = {
        events: provinceEvents.length,
        registrations: provinceEvents.reduce((sum, e) => sum + e.registeredCount, 0),
        revenue: provinceEvents.reduce((sum, e) => sum + (e.registeredCount * e.price), 0),
        users: provinceUsers.length,
        organizers: provinceUsers.filter(u => u.role === 'organizer').length
      };
      return acc;
    }, {});
    
    // Event category performance
    const categoryStats = EVENT_CATEGORIES.reduce((acc, category) => {
      const categoryEvents = events.filter(e => e.category === category.name);
      acc[category.name] = {
        events: categoryEvents.length,
        registrations: categoryEvents.reduce((sum, e) => sum + e.registeredCount, 0),
        revenue: categoryEvents.reduce((sum, e) => sum + (e.registeredCount * e.price), 0),
        avgPrice: categoryEvents.length > 0 
          ? categoryEvents.reduce((sum, e) => sum + e.price, 0) / categoryEvents.length 
          : 0,
        icon: category.icon
      };
      return acc;
    }, {});
    
    // Payment method distribution (simulated)
    const paymentStats = {
      'eSewa': { transactions: Math.floor(totalRegistrations * 0.65), amount: totalRevenue * 0.65 },
      'Khalti': { transactions: Math.floor(totalRegistrations * 0.25), amount: totalRevenue * 0.25 },
      'IME Pay': { transactions: Math.floor(totalRegistrations * 0.08), amount: totalRevenue * 0.08 },
      'Bank Transfer': { transactions: Math.floor(totalRegistrations * 0.02), amount: totalRevenue * 0.02 }
    };
    
    // System health metrics
    const systemHealth = {
      activeEvents: events.filter(e => e.status === 'upcoming').length,
      completedEvents: events.filter(e => e.status === 'completed').length,
      cancelledEvents: events.filter(e => e.status === 'cancelled').length,
      occupancyRate: (totalRegistrations / totalCapacity) * 100,
      userGrowthRate: 15.3, // Simulated
      revenueGrowthRate: 23.7 // Simulated
    };
    
    // Recent admin activities (mock data)
    const recentActivities = [
      { id: 1, action: 'User Verified', target: 'Bimal Tech Nepal', time: '2 hours ago', type: 'verification' },
      { id: 2, action: 'Event Approved', target: 'Himalayan Business Conference', time: '4 hours ago', type: 'approval' },
      { id: 3, action: 'Payment Dispute Resolved', target: 'Transaction #ESEWA-1234567', time: '6 hours ago', type: 'payment' },
      { id: 4, action: 'Organizer Suspended', target: 'Suspicious Account', time: '1 day ago', type: 'moderation' },
      { id: 5, action: 'System Backup Completed', target: 'Daily Backup', time: '1 day ago', type: 'system' }
    ];
    
    return {
      totalEvents: events.length,
      totalRevenue,
      totalRegistrations,
      totalUsers: users.length,
      avgTicketPrice,
      usersByRole,
      verifiedOrganizers,
      unverifiedOrganizers,
      provinceStats,
      categoryStats,
      paymentStats,
      systemHealth,
      recentActivities
    };
  }, [selectedProvince, timeRange]);

  const StatCard = ({ title, value, subtitle, icon, color, trend, onClick }) => (
    <div 
      className={`bg-gradient-to-br ${color} text-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      {trend && (
        <div className="flex items-center mt-2">
          <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setSelectedTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        selectedTab === id 
          ? 'bg-red-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              🛡️ Admin Control Panel
            </h1>
            <p className="text-gray-600">Complete system oversight for Nepal Event Management</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Provinces</option>
              {NEPAL_PROVINCES.map(province => (
                <option key={province.id} value={province.name}>{province.name}</option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <TabButton id="overview" label="Overview" icon="📊" />
          <TabButton id="users" label="User Management" icon="👥" />
          <TabButton id="events" label="Event Control" icon="🎉" />
          <TabButton id="finances" label="Financial Analytics" icon="💰" />
          <TabButton id="system" label="System Health" icon="⚙️" />
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={`${CURRENCY.symbol}${adminStats.totalRevenue.toLocaleString()}`}
                subtitle={`${adminStats.totalRegistrations.toLocaleString()} total bookings`}
                icon="💰"
                color="from-green-500 to-green-600"
                trend={adminStats.systemHealth.revenueGrowthRate}
                onClick={() => setSelectedTab('finances')}
              />
              <StatCard
                title="Active Events"
                value={adminStats.totalEvents}
                subtitle={`${adminStats.systemHealth.activeEvents} upcoming`}
                icon="🎉"
                color="from-blue-500 to-blue-600"
                trend={8.3}
                onClick={() => setSelectedTab('events')}
              />
              <StatCard
                title="System Users"
                value={adminStats.totalUsers}
                subtitle={`${adminStats.unverifiedOrganizers} pending verification`}
                icon="👥"
                color="from-purple-500 to-purple-600"
                trend={adminStats.systemHealth.userGrowthRate}
                onClick={() => setSelectedTab('users')}
              />
              <StatCard
                title="System Health"
                value={`${adminStats.systemHealth.occupancyRate.toFixed(1)}%`}
                subtitle="Platform utilization"
                icon="⚙️"
                color="from-red-500 to-red-600"
                trend={5.7}
                onClick={() => setSelectedTab('system')}
              />
            </div>

            {/* Province Performance & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Province Performance</h2>
                  <span className="text-2xl">🏛️</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(adminStats.provinceStats)
                    .sort(([,a], [,b]) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map(([province, data]) => (
                    <div key={province} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{province}</p>
                        <p className="text-sm text-gray-600">
                          {data.events} events • {data.users} users • {data.organizers} organizers
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{CURRENCY.symbol}{data.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{data.registrations} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors">
                    🔍 Review Pending Events
                  </button>
                  <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors">
                    ✅ Verify Organizers ({adminStats.unverifiedOrganizers})
                  </button>
                  <button className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg border border-yellow-200 transition-colors">
                    💳 Payment Disputes
                  </button>
                  <button className="w-full p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors">
                    📊 Generate Report
                  </button>
                  <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-colors">
                    ⚙️ System Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Admin Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Admin Activities</h2>
                <span className="text-2xl">📋</span>
              </div>
              <div className="space-y-4">
                {adminStats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        activity.type === 'verification' ? 'bg-green-500' :
                        activity.type === 'approval' ? 'bg-blue-500' :
                        activity.type === 'payment' ? 'bg-yellow-500' :
                        activity.type === 'moderation' ? 'bg-red-500' : 'bg-gray-500'
                      }`}>
                        {activity.type === 'verification' ? '✅' :
                         activity.type === 'approval' ? '👍' :
                         activity.type === 'payment' ? '💳' :
                         activity.type === 'moderation' ? '🚫' : '⚙️'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.target}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* User Management Tab */}
        {selectedTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  + Add User
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Export Users
                </button>
              </div>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(adminStats.usersByRole).map(([role, count]) => (
                <div key={role} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{role}s</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                </div>
              ))}
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockUsers.slice(0, 10).map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'organizer' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.city}, {user.province}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {!user.verified && (
                            <button className="text-green-600 hover:text-green-800">Verify</button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Suspend</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {selectedTab === 'events' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Event Control Center</h2>
            <p className="text-gray-600">Event management features coming soon...</p>
          </div>
        )}

        {selectedTab === 'finances' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Analytics</h2>
            <p className="text-gray-600">Detailed financial reports coming soon...</p>
          </div>
        )}

        {selectedTab === 'system' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Health Monitor</h2>
            <p className="text-gray-600">System monitoring dashboard coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;