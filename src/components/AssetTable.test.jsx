import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssetTable from './AssetTable';
import { AssetContext } from '../context/AssetContext';

// Mock EditModal to avoid rendering complexity
jest.mock('./EditModal', () => {
  return function EditModal({ asset, idx, onClose }) {
    return (
      <div data-testid="edit-modal">
        <div>Editing asset at index: {idx}</div>
        <div>Asset Code: {asset['Asset Code']}</div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('AssetTable Edit Details functionality', () => {
  const mockAssets = [
    {
      '_pav_id': 'asset1-0-123-abc',
      'Asset Code': 'A001',
      'Serial Number': 'SN001',
      'Make': 'Dell',
      'Model': 'Latitude',
      'Asset Type': 'Laptop',
      'Asset status': 'In use',
      'PAV Status': 'Available',
      'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)': '2024-01-15',
      'Asset Availability Remarks': 'Available in same branch',
      'New Branch Code': 'N/A',
      'Disposal Ticket': 'N/A',
      'Comment': ''
    },
    {
      '_pav_id': 'asset2-1-124-def',
      'Asset Code': 'A002',
      'Serial Number': 'SN002',
      'Make': 'HP',
      'Model': 'ProBook',
      'Asset Type': 'Laptop',
      'Asset status': 'In use',
      'PAV Status': 'Available',
      'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)': '2024-01-15',
      'Asset Availability Remarks': 'Available in same branch',
      'New Branch Code': 'N/A',
      'Disposal Ticket': 'N/A',
      'Comment': ''
    }
  ];

  const mockContextValue = {
    assets: mockAssets,
    setAssets: jest.fn(),
    filters: {},
    setFilters: jest.fn(),
    search: '',
    setSearch: jest.fn(),
    searchCriteria: 'Serial Number',
    setSearchCriteria: jest.fn(),
    suppressAutoDisplay: false,
    setSuppressAutoDisplay: jest.fn(),
    engineerName: 'Test Engineer',
    setEngineerName: jest.fn(),
    defaultPavDate: '2024-01-15',
    setDefaultPavDate: jest.fn(),
    saveChanges: jest.fn()
  };

  it('should open Edit Details modal when Edit Details button is clicked', async () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <AssetTable />
      </AssetContext.Provider>
    );

    // Find all "Edit Details" buttons
    const editButtons = screen.getAllByText('Edit Details');
    expect(editButtons.length).toBeGreaterThan(0);

    // Click the first Edit Details button
    fireEvent.click(editButtons[0]);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });

    // Verify the correct asset is being edited
    expect(screen.getByText('Editing asset at index: 0')).toBeInTheDocument();
    expect(screen.getByText('Asset Code: A001')).toBeInTheDocument();
  });

  it('should open correct modal for second asset', async () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <AssetTable />
      </AssetContext.Provider>
    );

    const editButtons = screen.getAllByText('Edit Details');
    
    // Click the second Edit Details button
    fireEvent.click(editButtons[1]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });

    // Verify the correct asset is being edited
    expect(screen.getByText('Editing asset at index: 1')).toBeInTheDocument();
    expect(screen.getByText('Asset Code: A002')).toBeInTheDocument();
  });

  it('should work with filters applied', async () => {
    const contextWithFilters = {
      ...mockContextValue,
      filters: { assetType: 'Laptop' }
    };

    render(
      <AssetContext.Provider value={contextWithFilters}>
        <AssetTable />
      </AssetContext.Provider>
    );

    const editButtons = screen.getAllByText('Edit Details');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });
  });

  it('should close modal when close button is clicked', async () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <AssetTable />
      </AssetContext.Provider>
    );

    const editButtons = screen.getAllByText('Edit Details');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });

    // Click close button in modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    // Modal should disappear
    await waitFor(() => {
      expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
    });
  });
});
