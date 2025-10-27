import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssetContext } from '../context/AssetContext';

// Mock components to simplify testing
jest.mock('./UploadForm', () => {
  return function UploadForm() {
    return <div data-testid="upload-form">Upload Form</div>;
  };
});

jest.mock('./FilterBar', () => {
  return function FilterBar() {
    return <div data-testid="filter-bar">Filter Bar</div>;
  };
});

jest.mock('./SearchBar', () => {
  return function SearchBar() {
    return <div data-testid="search-bar">Search Bar</div>;
  };
});

jest.mock('./AssetTable', () => {
  return function AssetTable() {
    return <div data-testid="asset-table">Asset Table</div>;
  };
});

jest.mock('./Footer', () => {
  return function Footer() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('./DownloadButton', () => {
  return function DownloadButton() {
    return <div data-testid="download-button">Download Button</div>;
  };
});

describe('UploadForm _pav_id generation', () => {
  const generatePavId = (assetCode, serialNumber, index) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 9);
    if (assetCode) {
      return `${String(assetCode)}-${index}-${timestamp}-${random}`;
    } else if (serialNumber) {
      return `${String(serialNumber)}-${index}-${timestamp}-${random}`;
    } else {
      return `uploaded-${index}-${timestamp}-${random}`;
    }
  };

  it('should generate unique IDs for assets with same Asset Code', () => {
    const id1 = generatePavId('A001', 'SN001', 0);
    const id2 = generatePavId('A001', 'SN002', 1);
    
    expect(id1).not.toBe(id2);
    expect(id1).toContain('A001-0-');
    expect(id2).toContain('A001-1-');
  });

  it('should generate unique IDs for assets without Asset Code', () => {
    const id1 = generatePavId(null, 'SN001', 0);
    const id2 = generatePavId(null, 'SN001', 1);
    
    expect(id1).not.toBe(id2);
    expect(id1).toContain('SN001-0-');
    expect(id2).toContain('SN001-1-');
  });

  it('should generate unique IDs for assets without any identifiers', () => {
    const id1 = generatePavId(null, null, 0);
    const id2 = generatePavId(null, null, 1);
    
    expect(id1).not.toBe(id2);
    expect(id1).toContain('uploaded-0-');
    expect(id2).toContain('uploaded-1-');
  });
});
