import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (email: string, password: string, name: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('auction_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const users = JSON.parse(localStorage.getItem('auction_users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, role: foundUser.role, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('auction_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string, role: UserRole): boolean => {
    const users = JSON.parse(localStorage.getItem('auction_users') || '[]');
    
    if (users.some((u: any) => u.email === email && u.role === role)) {
      return false;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
      role,
    };

    users.push(newUser);
    localStorage.setItem('auction_users', JSON.stringify(users));

    const userData = { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name };
    setUser(userData);
    localStorage.setItem('auction_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auction_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
