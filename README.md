<div align="center">

# 📦 PAV Asset Verification App

### A Modern Solution for Physical Asset Verification

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge&logo=github)](https://rohilkohli.github.io/pav-asset-verification-app-clean)

</div>

---

## 🌟 Overview

**PAV Asset Verification App** is a powerful, client-side React application designed to streamline the Physical Asset Verification (PAV) process. Built with modern web technologies, it provides an intuitive interface for managing, editing, and exporting asset data without requiring any backend infrastructure.

### ✨ Key Features

- **📥 Easy Import** - Upload Excel (.xlsx) or CSV files with drag-and-drop support
- **🔍 Advanced Filtering** - Powerful search and filter capabilities to quickly find assets
- **✏️ Inline Editing** - Edit asset details with a theme-aware modal interface
- **💾 Auto-Save** - Changes are automatically saved to browser's localStorage
- **📤 Export Options** - Download updated data in Excel or CSV format
- **🎨 Dark/Light Mode** - Toggle between themes with proper visibility and contrast
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Zero Backend** - Runs entirely in the browser - no server required!
- **🚀 Optimized Performance** - React.memo and useMemo for fast rendering
- **♿ Accessible** - WCAG compliant with proper color contrast in all themes

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohilkohli/pav-asset-verification-app-clean.git
   cd pav-asset-verification-app-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be available in the `build` directory.

---

## 📖 How to Use

### 1️⃣ Upload Asset Data

- Click the **Upload** button to select your Excel (.xlsx) or CSV file
- The app will automatically parse and normalize the data
- Supported date formats are converted to standardized `YYYY-MM-DD` format

### 2️⃣ View and Filter Assets

- Browse assets displayed as interactive cards
- Use the **Search Bar** to find specific assets by any field
- Apply **Filters** to narrow down results by status, location, or other criteria
- Sort columns by clicking on column headers

### 3️⃣ Edit Asset Information

- Click the **Edit** button on any asset card
- Update fields in the modal dialog
- Validation rules ensure data consistency (e.g., required fields, conditional dependencies)
- Changes are automatically saved to localStorage

### 4️⃣ Export Your Data

- Click the **Download** button to export your data
- Choose between Excel (.xlsx) or CSV format
- All edits are included in the exported file

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React 18** | Core UI framework with Hooks | 18.2.0 |
| **Material-UI (MUI) v5** | Component library and theming | 5.14.0 |
| **XLSX** | Excel file parsing and generation | 0.18.5 |
| **Context API** | Global state management | Built-in |
| **localStorage** | Client-side data persistence | Built-in |
| **React Memo** | Performance optimization | Built-in |
| **useMemo/useCallback** | Memoization for expensive computations | Built-in |

---

## 📁 Project Structure

```
pav-asset-verification-app-clean/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components (all memoized)
│   │   ├── AssetTable.jsx  # Main asset display and filtering
│   │   ├── EditModal.jsx   # Theme-aware asset editing interface
│   │   ├── UploadForm.jsx  # File upload and parsing
│   │   ├── DownloadButton.jsx # Theme-aware export functionality
│   │   ├── SearchBar.jsx   # Search and filter controls
│   │   ├── FilterBar.jsx   # Additional filtering options
│   │   └── Footer.jsx      # Application footer
│   ├── context/            # React Context providers
│   │   └── AssetContext.jsx # Global state management with memoization
│   ├── styles/             # CSS styles (if any)
│   ├── App.jsx             # Root component with theme management
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## 🌐 Deployment

### Deploy to GitHub Pages

This repository includes automated deployment via GitHub Actions.

#### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. The GitHub Actions workflow will automatically:
   - Build the production bundle
   - Deploy to GitHub Pages
   - Make it available at: `https://rohilkohli.github.io/pav-asset-verification-app-clean`

#### Option 2: Manual Deployment

```bash
npm run deploy
```

This command will build and push the `build` directory to the `gh-pages` branch.

### Configuration

- Update the `homepage` field in `package.json` if using a different repository name
- Ensure GitHub Pages is enabled in your repository settings

---

## 🧪 Testing

### Running Tests

The project includes automated tests for critical components:

```bash
npm test
```

This runs the test suite which includes:
- **UploadForm Tests**: Validates file parsing and data normalization
- **AssetTable Tests**: Ensures filtering, sorting, and display logic work correctly

### Manual Testing with Sample Data

A sample test file `Rohil_Kohli_2025_10_17.xlsx` is included in the repository. To test the application:

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Upload the test file**:
   - Click the "Upload" button in the application
   - Select `Rohil_Kohli_2025_10_17.xlsx` from the repository root
   - Verify the data loads correctly and all fields are populated

3. **Test Core Features**:
   - **Search**: Try searching by Serial Number, Asset Code, or Make
   - **Filter**: Apply filters by Asset Type, Make, or PAV Status
   - **Edit**: Click "Edit Details" on any asset and modify fields
   - **Validation**: Test conditional validation (e.g., "Other" remarks require comments)
   - **Save**: Click "Save Changes" and verify data persists after page reload
   - **Export**: Download data in Excel or CSV format and verify all edits are included

4. **Test Theme Toggle**:
   - Switch between light and dark modes
   - Verify all UI elements are clearly visible in both themes

### Test Data Format

The test file should contain columns matching the PAV asset verification format:
- Asset Code
- Serial Number
- Make, Model, Asset Type
- PAV Status, PAV Date
- Asset Availability Remarks
- New Branch Code, Disposal Ticket, Comment
- Engineer Name

---

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at http://localhost:3000 |
| `npm run build` | Create production build (optimized, minified) |
| `npm test` | Run test suite (if tests are present) |
| `npm run deploy` | Deploy to GitHub Pages |

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/rohilkohli/pav-asset-verification-app-clean.git
   cd pav-asset-verification-app-clean
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000` with hot reload enabled.

3. **Test Your Changes**
   - Upload a sample Excel/CSV file (e.g., `Rohil_Kohli_2025_10_17.xlsx` or any PAV-formatted spreadsheet)
   - Test filtering and search functionality
   - Try editing assets using the "Edit Details" button
   - Toggle between light and dark themes
   - Test download functionality

4. **Run Tests**
   ```bash
   npm test
   ```
   Runs the test suite including component tests for UploadForm and AssetTable.

5. **Build for Production**
   ```bash
   npm run build
   ```
   Creates optimized production build in the `build/` directory.

### Key Implementation Details

- **Literal Header Keys**: The app uses exact spreadsheet column names for field mapping
- **Date Normalization**: Excel numeric serials and Date objects are converted to `YYYY-MM-DD` format
- **Persistent Storage**: All changes are automatically saved to `localStorage` under the key `pav_assets`
- **Validation Rules**: Conditional validation ensures data integrity (e.g., "Other" remarks require comments)
- **Theme Awareness**: All components detect and adapt to light/dark theme for optimal visibility
- **Performance Optimizations**:
  - React.memo wraps all components to prevent unnecessary re-renders
  - useMemo for expensive filtering and sorting operations
  - useCallback for event handlers to maintain referential equality
  - Optimized loops using native for loops instead of array methods where appropriate

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Use React hooks and functional components
- Wrap new components with React.memo for performance
- Use useCallback for event handlers
- Use useMemo for expensive computations
- Ensure theme awareness for UI components
- Test in both light and dark modes
- Maintain accessibility standards

### Feature Requests

Want server-side persistence, pagination for large datasets, or other features? Feel free to open an issue!

## 🐛 Known Issues & Limitations

- No backend database - all data stored in browser localStorage
- Large datasets (>1000 assets) may experience slower filtering
- Browser localStorage has size limitations (~5-10MB typically)
- No multi-user collaboration support
- Export limited to XLSX format (CSV coming soon)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

If you encounter any issues or have questions:

- 📫 Open an [Issue](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)
- ⭐ Star this repository if you find it useful!

## 🔒 Security & Privacy

- **Client-Side Only**: All processing happens in your browser
- **No Data Transmission**: Your asset data never leaves your computer
- **Local Storage**: Data persists only in your browser's localStorage
- **No Tracking**: No analytics or third-party tracking scripts
- **No Backend**: Zero server infrastructure means zero server-side vulnerabilities

## 📊 Performance Metrics

- **Initial Load**: ~250KB gzipped JavaScript bundle
- **Render Performance**: React.memo optimizations prevent unnecessary re-renders
- **Filtering Speed**: O(n) complexity with optimized loops
- **Memory Usage**: Efficient asset management with minimal memory overhead
- **Mobile Performance**: Responsive design works smoothly on mobile devices

---

<div align="center">

**Built with ❤️ using React and Material-UI**

[Live Demo](https://rohilkohli.github.io/pav-asset-verification-app-clean) • [Report Bug](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues) • [Request Feature](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)

</div>
