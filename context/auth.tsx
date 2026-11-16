import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isReady: boolean;
  login: (user: { email: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();

  if (!cleaned) return "Foodie";

  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(({ email }: { email: string }) => {
    const cleanEmail = email.trim().toLowerCase();
    setUser({
      email: cleanEmail,
      name: nameFromEmail(cleanEmail),
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      isReady: true,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
