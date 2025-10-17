import React, { createContext, useEffect, useState } from 'react';

export const AssetContext = createContext();

export function AssetProvider({ children }) {
  // Load assets from localStorage if available so edits persist between reloads.
  const [assets, setAssets] = useState(() => {
    try {
      const raw = localStorage.getItem('pav_assets');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // filteredAssets was unused across the app; remove to simplify state
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('Serial Number');
  // when true, newly uploaded data will not be shown until user applies filters/search
  const [suppressAutoDisplay, setSuppressAutoDisplay] = useState(false);
  const [engineerName, setEngineerName] = useState('');
  const [defaultPavDate, setDefaultPavDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Persistence is now explicit. Call saveChanges() to persist to localStorage.
  const saveChanges = () => {
    try {
      // Before persisting, apply Engineer Name and default PAV date to assets
      // that have been edited by the engineer (marked with _pav_edited flag)
      const toSave = (assets || []).map(a => {
        const copy = { ...a };
        // Only apply Engineer Name and PAV Date to assets that have been edited AND verified (PAV Status = "Available")
        if (copy['_pav_edited'] === true) {
          if (engineerName) copy['Engineer Name'] = engineerName;
          // Only apply PAV date if the asset has been verified (PAV Status is "Available")
          if (defaultPavDate && copy['PAV Status'] === 'Available') {
            copy['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'] = defaultPavDate;
          }
        }
        return copy;
      });
      // Update in-memory assets so UI reflects the applied values
      setAssets(toSave);
      localStorage.setItem('pav_assets', JSON.stringify(toSave));
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <AssetContext.Provider value={{
      assets, setAssets,
      filters, setFilters,
      search, setSearch,
      searchCriteria, setSearchCriteria,
      suppressAutoDisplay, setSuppressAutoDisplay,
      engineerName, setEngineerName,
      defaultPavDate, setDefaultPavDate,
      saveChanges
    }}>
      {children}
    </AssetContext.Provider>
  );
}
