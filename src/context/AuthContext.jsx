import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_USER_KEY = 'novatask_current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : {
        id: 'usr-demo',
        name: 'Alex Rivera',
        email: 'alex.rivera@novatask.dev',
        role: 'Principal Designer & Tech Lead',
        department: 'Design & Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try express backend if available
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setLoading(false);
          return { success: true, user: data.user };
        }
      } catch (err) {
        // Fall back to local check
      }

      // Local mock credentials check
      const mockUsers = [
        {
          id: 'usr-1',
          name: 'Sarah Jenkins',
          email: 'sarah@novatask.dev',
          password: 'Password123!',
          role: 'Lead Architect',
          department: 'Engineering',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
        },
        {
          id: 'usr-2',
          name: 'Alex Rivera',
          email: 'alex@novatask.dev',
          password: 'Password123!',
          role: 'Product Designer',
          department: 'Design',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        }
      ];

      const match = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match && match.password === password) {
        const { password: _, ...userData } = match;
        setUser(userData);
        setLoading(false);
        return { success: true, user: userData };
      }

      // If user provided any non-empty credentials for quick demo testing
      if (email.includes('@') && password.length >= 6) {
        const demoUser = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email.toLowerCase(),
          role: 'Senior Contributor',
          department: 'Product Ops',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        };
        setUser(demoUser);
        setLoading(false);
        return { success: true, user: demoUser };
      }

      setLoading(false);
      return { success: false, error: 'Invalid email or password. Use demo account or enter any valid email.' };
    } catch (e) {
      setLoading(false);
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = async ({ name, email, password, department, role }) => {
    setLoading(true);
    try {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department || 'Engineering',
        role: role || 'Product Contributor',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      };

      // Try express backend
      try {
        await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, department, role })
        });
      } catch (e) {}

      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (e) {
      setLoading(false);
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const demoLogin = (type = 'admin') => {
    if (type === 'admin') {
      const admin = {
        id: 'usr-admin',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@novatask.dev',
        role: 'Lead Architect & Admin',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
      };
      setUser(admin);
      return admin;
    } else {
      const member = {
        id: 'usr-member',
        name: 'Alex Rivera',
        email: 'alex.rivera@novatask.dev',
        role: 'Principal UI/UX Designer',
        department: 'Design',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };
      setUser(member);
      return member;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
