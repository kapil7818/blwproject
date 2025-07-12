import React, { useState } from 'react';
import { Users, FileText, CheckCircle, XCircle, Clock, Eye, Search, Filter, CreditCard, DollarSign, Phone, MapPin, Briefcase, Calendar, User, Mail } from 'lucide-react';
import { useApplications } from '../../contexts/ApplicationContext';

export default function AdminDashboard() {
  const { applications, updateApplicationStatus } = useApplications();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSport = sportFilter === 'all' || app.sport.toLowerCase() === sportFilter.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      app.data.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.data.personalInfo.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply active filter from stat cards
    let matchesActiveFilter = true;
    if (activeFilter === 'pending') {
      matchesActiveFilter = app.status === 'pending';
    } else if (activeFilter === 'approved') {
      matchesActiveFilter = app.status === 'approved';
    } else if (activeFilter === 'payment-due') {
      matchesActiveFilter = app.status === 'approved' && app.paymentStatus === 'pending';
    }
    
    return matchesStatus && matchesSport && matchesSearch && matchesActiveFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    paymentDue: applications.filter(app => app.status === 'approved' && app.paymentStatus === 'pending').length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
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

  const getMembershipFee = (sport: string, isRailway: boolean = false) => {
    const fees: { [key: string]: { railway: number; outsider: number } } = {
      golf: { railway: 50000, outsider: 200000 }, // Updated according to BLW Golf Club fee structure
      swimming: { railway: 18000, outsider: 25000 },
      tennis: { railway: 22000, outsider: 30000 },
      football: { railway: 15000, outsider: 20000 },
      basketball: { railway: 13000, outsider: 18000 },
      cricket: { railway: 16000, outsider: 22000 }
    };
    const sportFees = fees[sport.toLowerCase()] || { railway: 18000, outsider: 25000 };
    return isRailway ? sportFees.railway : sportFees.outsider;
  };

  const handleStatCardClick = (filterType: string) => {
    setActiveFilter(filterType);
    // Reset other filters when clicking stat cards
    setStatusFilter('all');
    setSportFilter('all');
    setSearchTerm('');
  };

  const handleApproval = (applicationId: string, sport: string) => {
    const app = applications.find(a => a.id === applicationId);
    const isRailway = app?.data.personalInfo.membershipType === 'railway';
    const fee = getMembershipFee(sport, isRailway);
    setPaymentAmount(fee.toString());
    setSelectedApplication(applicationId);
    setShowPaymentModal(true);
  };

  const handleStatusUpdate = (applicationId: string, newStatus: 'approved' | 'rejected') => {
    updateApplicationStatus(applicationId, newStatus);
    setShowPaymentModal(false);
    setSelectedApplication(null);
  };

  const selectedApp = applications.find(app => app.id === selectedApplication);

  const renderDetailSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="bg-gray-50 rounded-lg p-4">
        {children}
      </div>
    </div>
  );

  const renderDetailRow = (label: string, value: string | undefined) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-200 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="text-sm text-gray-900 md:col-span-2">{value || 'Not provided'}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage membership applications and club operations</p>
      </div>

      {/* Stats Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => handleStatCardClick('all')}
          className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </button>
        
        <button
          onClick={() => handleStatCardClick('pending')}
          className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </button>
        
        <button
          onClick={() => handleStatCardClick('approved')}
          className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'approved' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </button>
        
        <button
          onClick={() => handleStatCardClick('payment-due')}
          className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left ${
            activeFilter === 'payment-due' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Due</p>
              <p className="text-2xl font-bold text-orange-600">{stats.paymentDue}</p>
            </div>
            <CreditCard className="w-8 h-8 text-orange-500" />
          </div>
        </button>
      </div>

      {/* Active Filter Indicator */}
      {activeFilter !== 'all' && (
        <div className="mb-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-800 font-medium">
              Showing: {activeFilter === 'payment-due' ? 'Payment Due' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications
            </span>
          </div>
          <button
            onClick={() => handleStatCardClick('all')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Sports</option>
              <option value="golf">Golf</option>
              <option value="swimming">Swimming</option>
              <option value="tennis">Tennis</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="cricket">Cricket</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
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
                  Membership Fee
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => {
                const isRailway = application.data.personalInfo.membershipType === 'railway';
                const membershipFee = getMembershipFee(application.sport, isRailway);
                
                return (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.data.personalInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.data.personalInfo.contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {application.sport}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isRailway 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproval(application.id, application.sport)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No applications found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Fee Payment</h2>
              <p className="text-gray-600">
                Approve {selectedApp.data.personalInfo.name}'s application for {selectedApp.sport}
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-800 font-medium">Membership Type:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApp.data.personalInfo.membershipType === 'railway'
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {selectedApp.sport.toLowerCase() === 'golf' 
                    ? (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway/Govt' : 'Private') 
                    : (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway' : 'Outsider')
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Membership Fee:</span>
                <span className="text-2xl font-bold text-emerald-900">
                  ₹{getMembershipFee(selectedApp.sport, selectedApp.data.personalInfo.membershipType === 'railway').toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Upon approval, the member will be required to pay the membership fee 
                of ₹{getMembershipFee(selectedApp.sport, selectedApp.data.personalInfo.membershipType === 'railway').toLocaleString()} to complete their registration.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {selectedApp.sport.toLowerCase() === 'golf' 
                    ? (selectedApp.data.personalInfo.membershipType === 'railway' 
                        ? 'Railway/Government employee discount applied - reduced membership fee.'
                        : 'Standard private individual membership fee applies.'
                      )
                    : (selectedApp.data.personalInfo.membershipType === 'railway' 
                        ? 'Railway employee discount applied - reduced membership fee.'
                        : 'Standard outsider membership fee applies.'
                      )
                  }
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(selectedApp.id, 'approved');
                }}
                className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Send Payment Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && !showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Complete Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              {renderDetailSection(
                'Personal Information',
                <User className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {renderDetailRow('Full Name', selectedApp.data.personalInfo.name)}
                  {renderDetailRow('Father\'s Name', selectedApp.data.personalInfo.fatherName)}
                  {renderDetailRow('Date of Birth', selectedApp.data.personalInfo.dateOfBirth)}
                  {renderDetailRow('Aadhar Number', selectedApp.data.personalInfo.adharNumber)}
                  {renderDetailRow('PAN Number', selectedApp.data.personalInfo.panNumber)}
                  {renderDetailRow('Membership Type', 
                    selectedApp.sport.toLowerCase() === 'golf' 
                      ? (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway/Government Employee' : 'Private Individual')
                      : (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway Employee' : 'Outsider')
                  )}
                </div>
              )}

              {/* Contact Information */}
              {renderDetailSection(
                'Contact Information',
                <Phone className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {renderDetailRow('Email', selectedApp.data.personalInfo.contact.email)}
                  {renderDetailRow('Mobile', selectedApp.data.personalInfo.contact.mobile)}
                  {renderDetailRow('Office Phone', selectedApp.data.personalInfo.contact.office)}
                  {renderDetailRow('Residence Phone', selectedApp.data.personalInfo.contact.residence)}
                </div>
              )}

              {/* Address Information */}
              {renderDetailSection(
                'Address Information',
                <MapPin className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {renderDetailRow('Local Residence', selectedApp.data.personalInfo.address.local)}
                  {renderDetailRow('Permanent Address', selectedApp.data.personalInfo.address.permanent)}
                  {renderDetailRow('Office Address', selectedApp.data.personalInfo.address.office)}
                </div>
              )}

              {/* Professional Information */}
              {renderDetailSection(
                'Professional Information',
                <Briefcase className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {renderDetailRow('Profession', selectedApp.data.personalInfo.profession)}
                  {renderDetailRow('Position/Designation', selectedApp.data.personalInfo.position)}
                  {renderDetailRow('Educational Qualification', selectedApp.data.personalInfo.education)}
                  {renderDetailRow('Special Qualification', selectedApp.data.personalInfo.specialQualification)}
                </div>
              )}

              {/* Family Details */}
              {renderDetailSection(
                'Family Details',
                <Users className="w-5 h-5 mr-2" />,
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Spouse Information</h4>
                    <div className="space-y-2">
                      {renderDetailRow('Spouse Name', selectedApp.data.familyDetails.spouse.name)}
                      {renderDetailRow('Spouse Date of Birth', selectedApp.data.familyDetails.spouse.dateOfBirth)}
                    </div>
                  </div>
                  
                  {selectedApp.data.familyDetails.children.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Children Information</h4>
                      {selectedApp.data.familyDetails.children.map((child, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                          <div className="space-y-1">
                            {renderDetailRow(`Child ${index + 1} Name`, child.name)}
                            {renderDetailRow(`Child ${index + 1} Date of Birth`, child.dateOfBirth)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sport Specific Information */}
              {renderDetailSection(
                `${selectedApp.sport} Specific Information`,
                <FileText className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {selectedApp.sport.toLowerCase() === 'golf' ? (
                    <>
                      {renderDetailRow('Golf Experience', selectedApp.data.sportSpecific.golfExperience)}
                      {renderDetailRow('Possesses Golf Set', selectedApp.data.sportSpecific.hasGolfSet)}
                      {selectedApp.data.sportSpecific.hasGolfSet === 'no' && 
                        renderDetailRow('Plan to Obtain Golf Set', selectedApp.data.sportSpecific.golfSetPlan)}
                    </>
                  ) : (
                    renderDetailRow(`${selectedApp.sport} Experience`, selectedApp.data.sportSpecific.experience)
                  )}
                </div>
              )}

              {/* Documents */}
              {renderDetailSection(
                'Documents Submitted',
                <FileText className="w-5 h-5 mr-2" />,
                <div className="space-y-2">
                  {renderDetailRow('Passport Size Photo', selectedApp.data.documents.photo)}
                  {renderDetailRow('Aadhar Card', selectedApp.data.documents.adharCard)}
                  {renderDetailRow('PAN Card', selectedApp.data.documents.panCard)}
                </div>
              )}

              {/* Application Status and Actions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusIcon(selectedApp.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApp.status)}`}>
                        {selectedApp.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Membership Fee</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{getMembershipFee(selectedApp.sport, selectedApp.data.personalInfo.membershipType === 'railway').toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedApp.sport.toLowerCase() === 'golf' 
                        ? (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway/Govt Rate' : 'Private Rate')
                        : (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway Rate' : 'Standard Rate')
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderDetailRow('Sport Applied For', selectedApp.sport)}
                  {renderDetailRow('Application Submitted', selectedApp.submittedAt.toLocaleDateString())}
                  {renderDetailRow('Membership Type', 
                    selectedApp.sport.toLowerCase() === 'golf' 
                      ? (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway/Government Employee' : 'Private Individual')
                      : (selectedApp.data.personalInfo.membershipType === 'railway' ? 'Railway Employee' : 'Outsider')
                  )}
                </div>
                
                {selectedApp.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(true);
                      }}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Request Payment
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApp.id, 'rejected');
                        setSelectedApplication(null);
                      }}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}