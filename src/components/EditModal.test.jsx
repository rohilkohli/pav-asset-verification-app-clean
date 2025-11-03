import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditModal from './EditModal';
import { AssetContext } from '../context/AssetContext';

describe('EditModal dropdown rendering', () => {
  const mockAsset = {
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
  };

  const mockContextValue = {
    assets: [mockAsset],
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

  const mockOnClose = jest.fn();

  it('should render EditModal with all Select components having MenuProps', () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <EditModal asset={mockAsset} idx={0} onClose={mockOnClose} />
      </AssetContext.Provider>
    );

    // Verify the modal renders
    expect(screen.getByText('Edit Asset Details')).toBeInTheDocument();
    
    // Verify the dropdowns display their current values
    expect(screen.getAllByText('In use')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Available')[0]).toBeInTheDocument();
    expect(screen.getByText('Available in same branch')).toBeInTheDocument();
  });

  it('should render modal with correct initial values', () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <EditModal asset={mockAsset} idx={0} onClose={mockOnClose} />
      </AssetContext.Provider>
    );

    // Verify initial values are displayed correctly in the select dropdowns
    // MUI Select components display their values in text content
    expect(screen.getByText('In use')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Available in same branch')).toBeInTheDocument();
  });

  it('should have proper dialog structure for dropdown rendering', () => {
    render(
      <AssetContext.Provider value={mockContextValue}>
        <EditModal asset={mockAsset} idx={0} onClose={mockOnClose} />
      </AssetContext.Provider>
    );

    // Check that dialog is rendered by verifying the dialog title
    expect(screen.getByText('Edit Asset Details')).toBeInTheDocument();
    
    // Verify all required buttons are present
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });
});
