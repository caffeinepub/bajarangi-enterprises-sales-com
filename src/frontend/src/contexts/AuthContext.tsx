import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login: iiLogin, clear: iiClear, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    async function checkAdminStatus() {
      if (isAuthenticated && actor && identity) {
        setIsCheckingAdmin(true);
        try {
          const adminStatus = await actor.isAdmin(identity.getPrincipal());
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [isAuthenticated, actor, identity]);

  const login = () => {
    iiLogin();
  };

  const logout = () => {
    iiClear();
    setIsAdmin(false);
  };

  const isLoading = loginStatus === 'initializing' || loginStatus === 'logging-in' || isCheckingAdmin;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
