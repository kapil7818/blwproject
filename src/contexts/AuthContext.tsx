import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  mobile: string;
  profession: string;
  address: {
    local: string;
    permanent: string;
    office: string;
  };
  contact: {
    office: string;
    residence: string;
  };
  position: string;
  education: string;
  dateOfBirth: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('clubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'admin@club.com' && password === 'admin123') {
      const adminUser = { id: '1', email, name: 'Admin User', role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('clubUser', JSON.stringify(adminUser));
      return true;
    } else if (email === 'member@club.com' && password === 'member123') {
      const memberUser = { id: '2', email, name: 'John Doe', role: 'member' as const };
      setUser(memberUser);
      localStorage.setItem('clubUser', JSON.stringify(memberUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = { id: Date.now().toString(), email, name, role: 'member' as const };
    setUser(newUser);
    localStorage.setItem('clubUser', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (profile: UserProfile) => {
    if (user) {
      const updatedUser = { ...user, profile, name: profile.name, email: user.email };
      setUser(updatedUser);
      localStorage.setItem('clubUser', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clubUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}