import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "../data/mockUser";
import { register as accountRegister, login as accountLogin, logout as accountLogout, getSession, RegisterInput } from "../services/accountStore";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSession()
      .then((session) => {
        if (active) setUser(session);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const u = await accountLogin(email, password);
    setUser(u);
    return u;
  };

  const register = async (input: RegisterInput) => {
    const u = await accountRegister(input);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await accountLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
