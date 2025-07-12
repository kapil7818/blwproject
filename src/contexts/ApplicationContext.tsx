import React, { createContext, useContext, useState } from 'react';

export interface Application {
  id: string;
  userId: string;
  sport: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  membershipFee?: number;
  data: {
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
  };
}

interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'submittedAt'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  updatePaymentStatus: (id: string, paymentStatus: 'pending' | 'paid' | 'failed') => void;
  getUserApplications: (userId: string) => Application[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);

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

  const addApplication = (application: Omit<Application, 'id' | 'submittedAt'>) => {
    const isRailway = application.data.personalInfo.membershipType === 'railway';
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      submittedAt: new Date(),
      membershipFee: getMembershipFee(application.sport, isRailway),
      paymentStatus: 'pending'
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => 
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status,
            paymentStatus: status === 'approved' ? 'pending' : app.paymentStatus
          };
        }
        return app;
      })
    );
  };

  const updatePaymentStatus = (id: string, paymentStatus: 'pending' | 'paid' | 'failed') => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, paymentStatus } : app)
    );
  };

  const getUserApplications = (userId: string) => {
    return applications.filter(app => app.userId === userId);
  };

  return (
    <ApplicationContext.Provider value={{
      applications,
      addApplication,
      updateApplicationStatus,
      updatePaymentStatus,
      getUserApplications
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}