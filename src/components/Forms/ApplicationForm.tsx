import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Save, ArrowLeft, User, MapPin, Phone, Briefcase, Calendar, FileText, Users, AlertCircle, CheckCircle, Train, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';

interface FormData {
  personalInfo: {
    name: string;
    fatherName: string;
    membershipType: 'railway' | 'outsider';
    address: {
      local: string;
      permanent: string;
      office: string;
    };
    contact: {
      office: string;
      residence: string;
      mobile: string;
      email: string;
    };
    profession: string;
    position: string;
    education: string;
    specialQualification: string;
    dateOfBirth: string;
    adharNumber: string;
    panNumber: string;
  };
  familyDetails: {
    spouse: { name: string; dateOfBirth: string };
    children: Array<{ name: string; dateOfBirth: string }>;
  };
  sportSpecific: Record<string, any>;
  documents: {
    photo: string;
    adharCard: string;
    panCard: string;
  };
}

interface ValidationErrors {
  [key: string]: string[];
}

export default function ApplicationForm() {
  const { sport } = useParams<{ sport: string }>();
  const { user } = useAuth();
  const { addApplication } = useApplications();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: user?.profile?.name || user?.name || '',
      fatherName: '',
      membershipType: 'outsider',
      address: {
        local: user?.profile?.address?.local || '',
        permanent: user?.profile?.address?.permanent || '',
        office: user?.profile?.address?.office || ''
      },
      contact: {
        office: user?.profile?.contact?.office || '',
        residence: user?.profile?.contact?.residence || '',
        mobile: user?.profile?.mobile || '',
        email: user?.email || ''
      },
      profession: user?.profile?.profession || '',
      position: user?.profile?.position || '',
      education: user?.profile?.education || '',
      specialQualification: '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      adharNumber: '',
      panNumber: ''
    },
    familyDetails: {
      spouse: { name: '', dateOfBirth: '' },
      children: []
    },
    sportSpecific: {},
    documents: {
      photo: '',
      adharCard: '',
      panCard: ''
    }
  });

  const getMembershipFee = (sport: string, isRailway: boolean = false) => {
    const fees: { [key: string]: { railway: number; outsider: number } } = {
      golf: { railway: 50000, outsider: 200000 }, // Updated according to BLW Golf Club fee structure
      swimming: { railway: 18000, outsider: 25000 },
      tennis: { railway: 22000, outsider: 30000 },
      football: { railway: 15000, outsider: 20000 },
      basketball: { railway: 13000, outsider: 18000 },
      cricket: { railway: 16000, outsider: 22000 }
    };
    const sportFees = fees[sport?.toLowerCase() || 'golf'] || { railway: 18000, outsider: 25000 };
    return isRailway ? sportFees.railway : sportFees.outsider;
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.personalInfo.name.trim()) errors.push('Name is required');
        if (!formData.personalInfo.fatherName.trim()) errors.push('Father\'s name is required');
        if (!formData.personalInfo.membershipType) errors.push('Membership type is required');
        if (!formData.personalInfo.address.local.trim()) errors.push('Local residence address is required');
        if (!formData.personalInfo.address.permanent.trim()) errors.push('Permanent address is required');
        if (!formData.personalInfo.contact.mobile.trim()) errors.push('Mobile number is required');
        if (!formData.personalInfo.contact.email.trim()) errors.push('Email address is required');
        if (!formData.personalInfo.profession.trim()) errors.push('Profession is required');
        if (!formData.personalInfo.dateOfBirth) errors.push('Date of birth is required');
        if (!formData.personalInfo.adharNumber.trim()) errors.push('Aadhar number is required');
        if (!formData.personalInfo.panNumber.trim()) errors.push('PAN number is required');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.personalInfo.contact.email && !emailRegex.test(formData.personalInfo.contact.email)) {
          errors.push('Please enter a valid email address');
        }
        
        // Validate mobile number (basic validation)
        const mobileRegex = /^[0-9]{10}$/;
        if (formData.personalInfo.contact.mobile && !mobileRegex.test(formData.personalInfo.contact.mobile.replace(/\D/g, ''))) {
          errors.push('Please enter a valid 10-digit mobile number');
        }
        
        // Validate Aadhar number (12 digits)
        const aadharRegex = /^[0-9]{12}$/;
        if (formData.personalInfo.adharNumber && !aadharRegex.test(formData.personalInfo.adharNumber.replace(/\D/g, ''))) {
          errors.push('Aadhar number must be 12 digits');
        }
        
        // Validate PAN number format
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (formData.personalInfo.panNumber && !panRegex.test(formData.personalInfo.panNumber.toUpperCase())) {
          errors.push('PAN number format is invalid (e.g., ABCDE1234F)');
        }
        break;
        
      case 2: // Family Details - Optional but validate if provided
        if (formData.familyDetails.spouse.name && !formData.familyDetails.spouse.dateOfBirth) {
          errors.push('Spouse date of birth is required when spouse name is provided');
        }
        formData.familyDetails.children.forEach((child, index) => {
          if (child.name && !child.dateOfBirth) {
            errors.push(`Date of birth is required for child ${index + 1}`);
          }
          if (!child.name && child.dateOfBirth) {
            errors.push(`Name is required for child ${index + 1}`);
          }
        });
        break;
        
      case 3: // Sport Specific
        if (sport?.toLowerCase() === 'golf') {
          if (!formData.sportSpecific.golfExperience?.trim()) {
            errors.push('Golf experience description is required');
          }
          if (!formData.sportSpecific.hasGolfSet) {
            errors.push('Please specify if you possess a golf set');
          }
          if (formData.sportSpecific.hasGolfSet === 'no' && !formData.sportSpecific.golfSetPlan?.trim()) {
            errors.push('Please explain how you plan to obtain golf equipment');
          }
        } else {
          if (!formData.sportSpecific.experience?.trim()) {
            errors.push(`Previous experience in ${sport} is required`);
          }
        }
        break;
        
      case 4: // Documents
        if (!formData.documents.photo) errors.push('Passport size photo is required');
        if (!formData.documents.adharCard) errors.push('Aadhar card document is required');
        if (!formData.documents.panCard) errors.push('PAN card document is required');
        break;
    }
    
    return errors;
  };

  const validateAllSteps = (): ValidationErrors => {
    const allErrors: ValidationErrors = {};
    
    for (let step = 1; step <= 4; step++) {
      const stepErrors = validateStep(step);
      if (stepErrors.length > 0) {
        allErrors[`step${step}`] = stepErrors;
      }
    }
    
    return allErrors;
  };

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear validation errors for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        newErrors[key] = newErrors[key].filter(error => 
          !error.toLowerCase().includes(field.toLowerCase())
        );
        if (newErrors[key].length === 0) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleNestedInputChange = (section: keyof FormData, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      familyDetails: {
        ...prev.familyDetails,
        children: [...prev.familyDetails.children, { name: '', dateOfBirth: '' }]
      }
    }));
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyDetails: {
        ...prev.familyDetails,
        children: prev.familyDetails.children.filter((_, i) => i !== index)
      }
    }));
  };

  const handleNextStep = () => {
    const currentStepErrors = validateStep(currentStep);
    
    if (currentStepErrors.length > 0) {
      setValidationErrors({ [`step${currentStep}`]: currentStepErrors });
      setShowValidation(true);
      return;
    }
    
    setValidationErrors({});
    setShowValidation(false);
    setCurrentStep(Math.min(4, currentStep + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
    setShowValidation(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !sport) return;
    
    // Validate all steps before submission
    const allErrors = validateAllSteps();
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      setShowValidation(true);
      // Go to first step with errors
      const firstErrorStep = Math.min(...Object.keys(allErrors).map(key => parseInt(key.replace('step', ''))));
      setCurrentStep(firstErrorStep);
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      addApplication({
        userId: user.id,
        sport: sport,
        status: 'pending',
        data: formData
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Information', icon: User },
    { id: 2, name: 'Family Details', icon: Users },
    { id: 3, name: 'Sport Specific', icon: FileText },
    { id: 4, name: 'Documents', icon: Upload }
  ];

  const renderValidationErrors = (stepKey: string) => {
    const errors = validationErrors[stepKey];
    if (!errors || errors.length === 0) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-red-800 font-medium">Please fix the following issues:</h3>
        </div>
        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {showValidation && renderValidationErrors('step1')}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name (Block Letters) *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.name}
            onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.fatherName}
            onChange={(e) => handleInputChange('personalInfo', 'fatherName', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Enter father's name"
          />
        </div>
      </div>

      {/* Membership Type Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Train className="w-5 h-5 mr-2" />
          Membership Type *
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {sport?.toLowerCase() === 'golf' 
            ? 'Please select your membership category. Railway/Government employees get special discounted rates.'
            : 'Please select your membership category. Railway employees get special discounted rates.'
          }
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            formData.personalInfo.membershipType === 'railway' 
              ? 'border-blue-500 bg-blue-100' 
              : 'border-gray-300 hover:border-blue-300'
          }`}>
            <input
              type="radio"
              name="membershipType"
              value="railway"
              checked={formData.personalInfo.membershipType === 'railway'}
              onChange={(e) => handleInputChange('personalInfo', 'membershipType', e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center w-full">
              <Train className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {sport?.toLowerCase() === 'golf' ? 'Railway/Government Employee' : 'Railway Employee'}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {sport?.toLowerCase() === 'golf' 
                    ? 'Discounted membership for railway/government employees'
                    : 'Discounted membership fees for railway employees'
                  }
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-600">
                  {sport && `₹${getMembershipFee(sport, true).toLocaleString()}`}
                </div>
              </div>
            </div>
            {formData.personalInfo.membershipType === 'railway' && (
              <CheckCircle className="w-5 h-5 text-blue-600 absolute top-2 right-2" />
            )}
          </label>
          
          <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            formData.personalInfo.membershipType === 'outsider' 
              ? 'border-purple-500 bg-purple-100' 
              : 'border-gray-300 hover:border-purple-300'
          }`}>
            <input
              type="radio"
              name="membershipType"
              value="outsider"
              checked={formData.personalInfo.membershipType === 'outsider'}
              onChange={(e) => handleInputChange('personalInfo', 'membershipType', e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center w-full">
              <Building className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {sport?.toLowerCase() === 'golf' ? 'Private Individual' : 'Outsider'}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {sport?.toLowerCase() === 'golf' 
                    ? 'Standard membership for private individuals'
                    : 'Standard membership for general public'
                  }
                </div>
                <div className="text-xs sm:text-sm font-medium text-purple-600">
                  {sport && `₹${getMembershipFee(sport, false).toLocaleString()}`}
                </div>
              </div>
            </div>
            {formData.personalInfo.membershipType === 'outsider' && (
              <CheckCircle className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
            )}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Details
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Local Residence *
          </label>
          <textarea
            required
            value={formData.personalInfo.address.local}
            onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'local', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            rows={3}
            placeholder="Enter local address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permanent Address *
          </label>
          <textarea
            required
            value={formData.personalInfo.address.permanent}
            onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'permanent', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            rows={3}
            placeholder="Enter permanent address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Address
          </label>
          <textarea
            value={formData.personalInfo.address.office}
            onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'office', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            rows={3}
            placeholder="Enter office address"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Phone
            </label>
            <input
              type="tel"
              value={formData.personalInfo.contact.office}
              onChange={(e) => handleNestedInputChange('personalInfo', 'contact', 'office', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Office number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residence Phone
            </label>
            <input
              type="tel"
              value={formData.personalInfo.contact.residence}
              onChange={(e) => handleNestedInputChange('personalInfo', 'contact', 'residence', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Home number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile *
            </label>
            <input
              type="tel"
              required
              value={formData.personalInfo.contact.mobile}
              onChange={(e) => handleNestedInputChange('personalInfo', 'contact', 'mobile', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Mobile number"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.personalInfo.contact.email}
            onChange={(e) => handleNestedInputChange('personalInfo', 'contact', 'email', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profession *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.profession}
            onChange={(e) => handleInputChange('personalInfo', 'profession', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Your profession"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position/Designation
          </label>
          <input
            type="text"
            value={formData.personalInfo.position}
            onChange={(e) => handleInputChange('personalInfo', 'position', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Your position"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Educational Qualification
          </label>
          <input
            type="text"
            value={formData.personalInfo.education}
            onChange={(e) => handleInputChange('personalInfo', 'education', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Your education"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Qualification
          </label>
          <input
            type="text"
            value={formData.personalInfo.specialQualification}
            onChange={(e) => handleInputChange('personalInfo', 'specialQualification', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Any special qualifications"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            required
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhar Number *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.adharNumber}
            onChange={(e) => handleInputChange('personalInfo', 'adharNumber', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="12-digit Aadhar number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number *
          </label>
          <input
            type="text"
            required
            value={formData.personalInfo.panNumber}
            onChange={(e) => handleInputChange('personalInfo', 'panNumber', e.target.value.toUpperCase())}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="PAN number (e.g., ABCDE1234F)"
          />
        </div>
      </div>
    </div>
  );

  const renderFamilyDetails = () => (
    <div className="space-y-6">
      {showValidation && renderValidationErrors('step2')}
      
      <h3 className="text-lg font-semibold text-gray-900">Family Details</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Name
          </label>
          <input
            type="text"
            value={formData.familyDetails.spouse.name}
            onChange={(e) => handleNestedInputChange('familyDetails', 'spouse', 'name', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Spouse name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spouse Date of Birth
          </label>
          <input
            type="date"
            value={formData.familyDetails.spouse.dateOfBirth}
            onChange={(e) => handleNestedInputChange('familyDetails', 'spouse', 'dateOfBirth', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h4 className="text-md font-semibold text-gray-900">Children</h4>
          <button
            type="button"
            onClick={addChild}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm self-start sm:self-auto"
          >
            Add Child
          </button>
        </div>
        
        {formData.familyDetails.children.map((child, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child {index + 1} Name
              </label>
              <input
                type="text"
                value={child.name}
                onChange={(e) => {
                  const newChildren = [...formData.familyDetails.children];
                  newChildren[index].name = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    familyDetails: {
                      ...prev.familyDetails,
                      children: newChildren
                    }
                  }));
                }}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Child name"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={child.dateOfBirth}
                  onChange={(e) => {
                    const newChildren = [...formData.familyDetails.children];
                    newChildren[index].dateOfBirth = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      familyDetails: {
                        ...prev.familyDetails,
                        children: newChildren
                      }
                    }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="bg-red-500 text-white px-3 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSportSpecific = () => {
    return (
      <div className="space-y-6">
        {showValidation && renderValidationErrors('step3')}
        
        {sport?.toLowerCase() === 'golf' ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900">Golf-Specific Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Golf Experience (Handicap) *
              </label>
              <textarea
                required
                value={formData.sportSpecific.golfExperience || ''}
                onChange={(e) => handleInputChange('sportSpecific', 'golfExperience', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                rows={3}
                placeholder="Describe your golf experience and handicap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you possess a golf set? *
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasGolfSet"
                    value="yes"
                    checked={formData.sportSpecific.hasGolfSet === 'yes'}
                    onChange={(e) => handleInputChange('sportSpecific', 'hasGolfSet', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasGolfSet"
                    value="no"
                    checked={formData.sportSpecific.hasGolfSet === 'no'}
                    onChange={(e) => handleInputChange('sportSpecific', 'hasGolfSet', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            
            {formData.sportSpecific.hasGolfSet === 'no' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How and when do you propose to obtain it? *
                </label>
                <textarea
                  required
                  value={formData.sportSpecific.golfSetPlan || ''}
                  onChange={(e) => handleInputChange('sportSpecific', 'golfSetPlan', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                  rows={3}
                  placeholder="Explain your plan to obtain golf equipment"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{sport} Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience in {sport} *
              </label>
              <textarea
                required
                value={formData.sportSpecific.experience || ''}
                onChange={(e) => handleInputChange('sportSpecific', 'experience', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                rows={4}
                placeholder={`Describe your experience in ${sport}`}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDocuments = () => (
    <div className="space-y-6">
      {showValidation && renderValidationErrors('step4')}
      
      <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
      <p className="text-sm text-gray-600">
        Please upload the following documents. All documents should be clear and readable.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition-colors">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-2">Passport Size Photo *</p>
          <p className="text-xs text-gray-500 mb-4">Upload a recent passport size photograph</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange('documents', 'photo', file.name);
              }
            }}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer text-sm"
          >
            Choose File
          </label>
          {formData.documents.photo && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {formData.documents.photo}
            </p>
          )}
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition-colors">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-2">Aadhar Card *</p>
          <p className="text-xs text-gray-500 mb-4">Upload a clear copy of your Aadhar card</p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange('documents', 'adharCard', file.name);
              }
            }}
            className="hidden"
            id="adhar-upload"
          />
          <label
            htmlFor="adhar-upload"
            className="bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer text-sm"
          >
            Choose File
          </label>
          {formData.documents.adharCard && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {formData.documents.adharCard}
            </p>
          )}
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-emerald-500 transition-colors">
          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-2">PAN Card *</p>
          <p className="text-xs text-gray-500 mb-4">Upload a clear copy of your PAN card</p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange('documents', 'panCard', file.name);
              }
            }}
            className="hidden"
            id="pan-upload"
          />
          <label
            htmlFor="pan-upload"
            className="bg-emerald-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer text-sm"
          >
            Choose File
          </label>
          {formData.documents.panCard && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              {formData.documents.panCard}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Declaration</h4>
        <p className="text-sm text-blue-800">
          I shall abide by Club Rules/Bye-Laws/{sport} rules now in force or made herein after time to time.
        </p>
        <label className="flex items-center mt-3">
          <input
            type="checkbox"
            required
            className="mr-2"
          />
          <span className="text-sm text-blue-900">I agree to the above declaration *</span>
        </label>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderFamilyDetails();
      case 3:
        return renderSportSpecific();
      case 4:
        return renderDocuments();
      default:
        return renderPersonalInfo();
    }
  };

  // Show overall validation summary if there are errors across multiple steps
  const renderOverallValidation = () => {
    if (!showValidation || Object.keys(validationErrors).length <= 1) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-red-800 font-medium">Application has incomplete sections:</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(validationErrors).map(([stepKey, errors]) => {
            const stepNumber = parseInt(stepKey.replace('step', ''));
            const stepName = steps.find(s => s.id === stepNumber)?.name;
            return (
              <div key={stepKey} className="text-sm">
                <button
                  type="button"
                  onClick={() => setCurrentStep(stepNumber)}
                  className="text-red-700 hover:text-red-900 font-medium underline"
                >
                  {stepName}: {errors.length} issue{errors.length > 1 ? 's' : ''}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 capitalize">
          {sport} Membership Application
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Complete all sections to submit your membership application
        </p>
        
        {/* Membership Fee Display */}
        <div className="mt-4 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-medium text-gray-900">Membership Fee</h3>
              <p className="text-sm text-gray-600">
                {sport?.toLowerCase() === 'golf' 
                  ? (formData.personalInfo.membershipType === 'railway' 
                      ? 'Railway/Government Employee Rate (Discounted)' 
                      : 'Private Individual Rate'
                    )
                  : (formData.personalInfo.membershipType === 'railway' 
                      ? 'Railway Employee Rate (Discounted)' 
                      : 'Standard Rate'
                    )
                }
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                ₹{getMembershipFee(sport || 'golf', formData.personalInfo.membershipType === 'railway').toLocaleString()}
              </p>
              {formData.personalInfo.membershipType === 'railway' && (
                <p className="text-sm text-blue-600">
                  Save ₹{(getMembershipFee(sport || 'golf', false) - getMembershipFee(sport || 'golf', true)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 relative ${
                currentStep >= step.id
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {validationErrors[`step${step.id}`] && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>
              <span className={`ml-2 text-xs sm:text-sm font-medium hidden sm:block ${
                currentStep >= step.id ? 'text-emerald-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                  currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile step name */}
        <div className="sm:hidden text-center mt-2">
          <span className="text-sm font-medium text-emerald-600">
            {steps.find(s => s.id === currentStep)?.name}
          </span>
        </div>
      </div>

      {/* Overall Validation Summary */}
      {renderOverallValidation()}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 sm:px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 order-1 sm:order-2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}