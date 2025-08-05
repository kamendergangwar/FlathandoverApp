import { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logout as logoutAction, clearError } from '@/store/slices/authSlice';

interface User {
  id: string;
  name: string;
  agentId: string;
  email: string;
  mobile: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user: reduxUser, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Map reduxUser to match the local User interface if necessary
  const user: User | null = reduxUser
    ? {
        id: reduxUser.id,
        name: reduxUser.username,
        agentId: reduxUser.id,
        email: reduxUser.emailId,
        mobile: reduxUser.mobile,
        isActive: reduxUser.isActive,
      }
    : null;

  useEffect(() => {
    // Check for existing session on app start
    // In a real app, you might check AsyncStorage or secure storage here
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    try {
      const result = await dispatch(loginUser({ username: mobile, password }));
      return loginUser.fulfilled.match(result);
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      error, 
      clearError: handleClearError 
    }}>
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