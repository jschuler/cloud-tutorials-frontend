import React from "react";

export const AuthContext = React.createContext({
  getToken: () => Promise.resolve(""),
});
