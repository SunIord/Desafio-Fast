import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "workshop_tracker_token";
const USERNAME_KEY = "workshop_tracker_username";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState(() =>
    localStorage.getItem(USERNAME_KEY)
  );

  function login(novoToken, novoUsername) {
    localStorage.setItem(TOKEN_KEY, novoToken);
    localStorage.setItem(USERNAME_KEY, novoUsername);
    setToken(novoToken);
    setUsername(novoUsername);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}