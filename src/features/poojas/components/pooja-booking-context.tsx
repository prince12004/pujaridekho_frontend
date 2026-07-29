"use client";

import { createContext, useContext, useState } from "react";

export interface PoojaPackageSelection {
  name: string;
  price: number;
}

export interface SelectedSamagriItem {
  name: string;
  price: number;
}

interface PoojaBookingContextValue {
  selectedPackage: PoojaPackageSelection | null;
  setSelectedPackage: (pkg: PoojaPackageSelection | null) => void;
  selectedSamagri: SelectedSamagriItem[];
  setSelectedSamagri: (items: SelectedSamagriItem[]) => void;
}

const defaultValue: PoojaBookingContextValue = {
  selectedPackage: null,
  setSelectedPackage: () => {},
  selectedSamagri: [],
  setSelectedSamagri: () => {},
};

const PoojaBookingContext = createContext<PoojaBookingContextValue>(defaultValue);

export function PoojaBookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedPackage, setSelectedPackage] = useState<PoojaPackageSelection | null>(null);
  const [selectedSamagri, setSelectedSamagri] = useState<SelectedSamagriItem[]>([]);
  return (
    <PoojaBookingContext.Provider value={{ selectedPackage, setSelectedPackage, selectedSamagri, setSelectedSamagri }}>
      {children}
    </PoojaBookingContext.Provider>
  );
}

/** Safe outside a PoojaBookingProvider too — returns the no-op default so
 * BookingWidget can be reused on pages (homepage, etc.) with no package/
 * samagri selection concept at all. */
export function usePoojaBookingSelection() {
  return useContext(PoojaBookingContext);
}
