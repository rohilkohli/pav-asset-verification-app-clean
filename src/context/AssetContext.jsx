import React, { createContext, useCallback, useMemo, useState } from 'react';

export const AssetContext = createContext();

export function AssetProvider({ children }) {
  // Load assets from localStorage if available so edits persist between reloads.
  const [assets, setAssets] = useState(() => {
    try {
      const raw = localStorage.getItem('pav_assets');
      const parsed = raw ? JSON.parse(raw) : [];
      // Ensure all assets have _pav_id (for backward compatibility with old data)
      return parsed.map((asset, idx) => {
        if (!asset['_pav_id']) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).slice(2, 9);
          if (asset['Asset Code']) {
            asset['_pav_id'] = `${String(asset['Asset Code'])}-${idx}-${timestamp}-${random}`;
          } else if (asset['Serial Number']) {
            asset['_pav_id'] = `${String(asset['Serial Number'])}-${idx}-${timestamp}-${random}`;
          } else {
            asset['_pav_id'] = `loaded-${idx}-${timestamp}-${random}`;
          }
        }
        return asset;
      });
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
  // Memoize with useCallback to prevent recreation on every render
  const saveChanges = useCallback(() => {
    try {
      // Before persisting, apply Engineer Name and default PAV date to assets
      // that have been edited by the engineer (marked with _pav_edited flag)
      const toSave = (assets || []).map(a => {
        const copy = { ...a };
        // Only apply Engineer Name and PAV Date to assets that have been edited AND verified (PAV Status = "Available")
        if (copy['_pav_edited'] === true) {
          if (engineerName) copy['Engineer Name'] = engineerName;
          // Only apply PAV date if the asset has been verified (PAV Status is "Available") 
          // AND the asset doesn't already have a PAV date (preserve existing dates)
          const existingPavDate = copy['PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'];
          const hasExistingDate = existingPavDate && existingPavDate.trim() !== '';
          if (defaultPavDate && copy['PAV Status'] === 'Available' && !hasExistingDate) {
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
  }, [assets, engineerName, defaultPavDate]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    assets, setAssets,
    filters, setFilters,
    search, setSearch,
    searchCriteria, setSearchCriteria,
    suppressAutoDisplay, setSuppressAutoDisplay,
    engineerName, setEngineerName,
    defaultPavDate, setDefaultPavDate,
    saveChanges
  }), [
    assets, filters, search, searchCriteria, 
    suppressAutoDisplay, engineerName, defaultPavDate, saveChanges
  ]);

  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  );
}
