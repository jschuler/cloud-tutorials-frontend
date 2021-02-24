import React from 'react';

export interface IAuthContext {
  getToken: () => Promise<string>
  getUsername: () => Promise<string>
}

export const AuthContext = React.createContext<IAuthContext | undefined>({
  getToken: () => Promise.resolve('asd'),
  getUsername: () => Promise.resolve('test')
});
