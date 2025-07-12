import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Train, Clock, CheckCircle, XCircle, Plus, FileText, CreditCard, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';

const sports = [
  { 
    name: 'Golf', 
    icon: '🏌️', 
    color: 'from-green-500 to-emerald-600', 
    railwayFee: 50000, // Permanent Membership for Retired Central Govt./State Govt./PSU Officials (Except Railways)
    outsiderFee: 200000 // Membership for Private members - Permanent Membership for private individuals (Two Lakhs only)
  },
  { name: 'Swimming', icon: '🏊', color: 'from-blue-500 to-cyan-600', railwayFee: 18000, outsiderFee: 25000 },
  { name: 'Tennis', icon: '🎾', color: 'from-yellow-500 to-orange-600', railwayFee: 22000, outsiderFee: 30000 },
  { name: 'Football', icon: '⚽', color: 'from-red-500 to-pink-600', railwayFee: 15000, outsiderFee: 20000 },
  { name: 'Basketball', icon: '🏀', color: 'from-orange-500 to-red-600', railwayFee: 13000, outsiderFee: 18000 },
  { name: 'Cricket', icon: '🏏', color: 'from-purple-500 to-indigo-600', railwayFee: 16000, outsiderFee: 22000 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserApplications } = useApplications();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const userApplications = user ? getUserApplications(user.id) : [];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string | undefined) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getMembershipFee = (sport: string, isRailway: boolean = false) => {
    const sportData = sports.find(s => s.name.toLowerCase() === sport.toLowerCase());
    if (!sportData) return isRailway ? 18000 : 25000;
    return isRailway ? sportData.railwayFee : sportData.outsiderFee;
  };

  const handleStatCardClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  // Filter applications based on active filter
  const filteredApplications = userApplications.filter(app => {
    switch (activeFilter) {
      case 'approved':
        return app.status === 'approved';
      case 'pending':
        return app.status === 'pending';
      case 'payment-due':
        return app.status === 'approved' && app.paymentStatus === 'pending';
      default:
        return true; // 'all' - show all applications
    }
  });

  const stats = {
    total: userApplications.length,
    approved: userApplications.filter(app => app.status === 'approved').length,
    pending: userApplications.filter(app => app.status === 'pending').length,
    paymentDue: userApplications.filter(app => app.status === 'approved' && app.paymentStatus === 'pending').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center mb-4">
          <Train className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your BLW Sports Club memberships and track your applications
            </p>
          </div>
        </div>
        
        {/* Railway Heritage Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Train className="w-5 h-5" />
              <span className="text-sm font-medium">BLW Railway Sports Community</span>
            </div>
            <span className="text-xs bg-orange-400 px-2 py-1 rounded-full">
              Railway Member Benefits Active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Now Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <button
          onClick={() => handleStatCardClick('all')}
          className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Applications</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </button>
        
        <button
          onClick={() => handleStatCardClick('approved')}
          className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'approved' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Approved</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0 ml-2" />
          </div>
        </button>
        
        <button
          onClick={() => handleStatCardClick('pending')}
          className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-yellow-600 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0 ml-2" />
          </div>
        </button>

        <button
          onClick={() => handleStatCardClick('payment-due')}
          className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-orange-600 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'payment-due' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Payment Due</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.paymentDue}</p>
            </div>
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0 ml-2" />
          </div>
        </button>
      </div>

      {/* Active Filter Indicator */}
      {activeFilter !== 'all' && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 gap-3 sm:gap-0">
          <div className="flex items-center">
            <Train className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium text-sm sm:text-base">
              Showing: {activeFilter === 'payment-due' ? 'Payment Due' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications
            </span>
          </div>
          <button
            onClick={() => handleStatCardClick('all')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base self-start sm:self-auto"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Sports Applications */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <Train className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Railway Sports Membership Applications</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sports.map((sport) => {
            const hasApplication = userApplications.some(app => 
              app.sport.toLowerCase() === sport.name.toLowerCase()
            );
            
            return (
              <div key={sport.name} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl sm:text-4xl">{sport.icon}</div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${sport.color} flex items-center justify-center`}>
                    <Train className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{sport.name}</h3>
                <div className="space-y-1 mb-3">
                  {sport.name === 'Golf' ? (
                    <>
                      <div className="flex items-center text-xs sm:text-sm text-blue-600">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Railway/Govt: ₹{sport.railwayFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Private: ₹{sport.outsiderFee.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-xs sm:text-sm text-blue-600">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Railway: ₹{sport.railwayFee.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Outsider: ₹{sport.outsiderFee.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {hasApplication ? 'Application submitted' : 'Apply for railway sports membership'}
                </p>
                {hasApplication ? (
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(userApplications.find(app => 
                      app.sport.toLowerCase() === sport.name.toLowerCase()
                    )?.status || 'pending')}
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      getStatusColor(userApplications.find(app => 
                        app.sport.toLowerCase() === sport.name.toLowerCase()
                      )?.status || 'pending')
                    }`}>
                      {userApplications.find(app => 
                        app.sport.toLowerCase() === sport.name.toLowerCase()
                      )?.status || 'pending'}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={`/apply/${sport.name.toLowerCase()}`}
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Apply Now</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Applications */}
      {userApplications.length > 0 && (
        <div>
          <div className="flex items-center mb-4 sm:mb-6">
            <Train className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Railway Sports Applications</h2>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredApplications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => {
                    const isRailway = application.data.personalInfo.membershipType === 'railway';
                    const membershipFee = getMembershipFee(application.sport, isRailway);
                    
                    return (
                      <div key={application.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {sports.find(s => s.name.toLowerCase() === application.sport.toLowerCase())?.icon}
                            </span>
                            <div>
                              <h3 className="font-medium text-gray-900 capitalize">{application.sport}</h3>
                              <p className="text-sm text-gray-500">{application.submittedAt.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(application.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Membership Type:</span>
                            <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                              isRailway 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {application.sport.toLowerCase() === 'golf' 
                                ? (isRailway ? 'Railway/Govt' : 'Private') 
                                : (isRailway ? 'Railway' : 'Outsider')
                              }
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Membership Fee:</span>
                            <div className="mt-1 flex items-center text-gray-900 font-medium">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ₹{membershipFee.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {application.status === 'approved' && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Payment Status:</span>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(application.paymentStatus)}`}>
                                {application.paymentStatus === 'pending' ? 'Payment Due' : 
                                 application.paymentStatus === 'paid' ? 'Paid' : 'Failed'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Train className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {activeFilter === 'all' 
                      ? 'No applications found' 
                      : `No ${activeFilter === 'payment-due' ? 'payment due' : activeFilter} applications found`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Membership Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Membership Fee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((application) => {
                    const isRailway = application.data.personalInfo.membershipType === 'railway';
                    const membershipFee = getMembershipFee(application.sport, isRailway);
                    
                    return (
                      <tr key={application.id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">
                              {sports.find(s => s.name.toLowerCase() === application.sport.toLowerCase())?.icon}
                            </span>
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {application.sport}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isRailway 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {application.sport.toLowerCase() === 'golf' 
                              ? (isRailway ? 'Railway/Govt' : 'Private') 
                              : (isRailway ? 'Railway' : 'Outsider')
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(application.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {application.status === 'approved' && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(application.paymentStatus)}`}>
                              {application.paymentStatus === 'pending' ? 'Payment Due' : 
                               application.paymentStatus === 'paid' ? 'Paid' : 'Failed'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ₹{membershipFee.toLocaleString()}
                            {isRailway && (
                              <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {application.sport.toLowerCase() === 'golf' ? 'Govt Rate' : 'Railway Rate'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {application.submittedAt.toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredApplications.length === 0 && (
                <div className="text-center py-12">
                  <Train className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {activeFilter === 'all' 
                      ? 'No applications found' 
                      : `No ${activeFilter === 'payment-due' ? 'payment due' : activeFilter} applications found`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}