import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface Client {
  role: string;
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInCredentials {
  document: string;
  password: string;
}

interface AuthContextData {
  client: Client;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateClient(client: Client): void;
}

interface AuthState {
  token: string;
  client: Client;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@PortalNorth:token');
    const client = localStorage.getItem('@PortalNorth:client');

    if (client && token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, client: JSON.parse(client) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ document, password }) => {
    const response = await api.post('/sessions', {
      document: document.replace(/[^\w\s]/gi, ''),
      password,
    });
    const { token, client } = response.data;
    localStorage.setItem('@PortalNorth:token', token);
    localStorage.setItem('@PortalNorth:client', JSON.stringify(client));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, client });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@PortalNorth:token');
    localStorage.removeItem('@PortalNorth:client');

    setData({} as AuthState);
  }, []);

  const updateClient = useCallback(
    (client: Client) => {
      setData({
        token: data.token,
        client,
      });

      localStorage.setItem('@PortalNorth:client', JSON.stringify(client));
    },
    [data.token, setData],
  );

  return (
    <AuthContext.Provider
      value={{
        client: data.client,
        signIn,
        signOut,
        updateClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthContext, AuthProvider, useAuth };
