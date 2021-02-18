import React from "react";

export const AuthContext = React.createContext({
  token: '',
  getToken: () => Promise.resolve(""),
});
