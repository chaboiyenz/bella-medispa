"use client";

import { createContext, useContext, type ReactNode } from "react";

interface AdminModeContextValue {
  isAdmin: boolean;
}

const AdminModeContext = createContext<AdminModeContextValue>({ isAdmin: false });

/**
 * Wrap the app with this provider in the root layout.
 * Pass `isAdmin` fetched server-side so client components can read it
 * without a second DB round-trip.
 */
export function AdminModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  return (
    <AdminModeContext.Provider value={{ isAdmin }}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode(): AdminModeContextValue {
  return useContext(AdminModeContext);
}
