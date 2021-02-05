import React, { createContext } from "react";

export const AppDrawerContext = createContext({
    drawerTitle: '',
    setDrawerTitle: () => {},
    drawerOpen: false,
    setDrawerOpen: () => {},
    drawerContent: null,
    setDrawerContent: () => {}
});