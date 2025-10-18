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
- **✏️ Inline Editing** - Edit asset details with a user-friendly modal interface
- **💾 Auto-Save** - Changes are automatically saved to browser's localStorage
- **📤 Export Options** - Download updated data in Excel or CSV format
- **🎨 Dark Mode** - Toggle between light and dark themes for comfortable viewing
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Zero Backend** - Runs entirely in the browser - no server required!

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

| Technology | Purpose |
|-----------|---------|
| **React 18** | Core UI framework |
| **Material-UI (MUI) v5** | Component library and theming |
| **XLSX** | Excel file parsing and generation |
| **Context API** | Global state management |
| **localStorage** | Client-side data persistence |

---

## 📁 Project Structure

```
pav-asset-verification-app-clean/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AssetTable.jsx  # Main asset display and filtering
│   │   ├── EditModal.jsx   # Asset editing interface
│   │   ├── UploadForm.jsx  # File upload and parsing
│   │   └── ...
│   ├── context/            # React Context providers
│   │   └── AssetContext.jsx # Global state management
│   ├── styles/             # CSS styles
│   ├── App.jsx             # Root component
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
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

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server at http://localhost:3000 |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run deploy` | Deploy to GitHub Pages |

### Key Implementation Details

- **Literal Header Keys**: The app uses exact spreadsheet column names for field mapping
- **Date Normalization**: Excel numeric serials and Date objects are converted to `YYYY-MM-DD` format
- **Persistent Storage**: All changes are automatically saved to `localStorage` under the key `pav_assets`
- **Validation Rules**: Conditional validation ensures data integrity (e.g., "Other" remarks require comments)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Feature Requests

Want server-side persistence, pagination for large datasets, or other features? Feel free to open an issue!

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

If you encounter any issues or have questions:

- 📫 Open an [Issue](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)
- ⭐ Star this repository if you find it useful!

---

<div align="center">

**Built with ❤️ using React and Material-UI**

[Live Demo](https://rohilkohli.github.io/pav-asset-verification-app-clean) • [Report Bug](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues) • [Request Feature](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)

</div>
