<div align="center">

# 📦 PAV Asset Verification App

### Modern Physical Asset Verification Made Simple

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.14.0-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=flat-square&logo=github)](https://rohilkohli.github.io/pav-asset-verification-app-clean)

[🚀 Live Demo](https://rohilkohli.github.io/pav-asset-verification-app-clean) • [📖 Docs](#documentation) • [🐛 Report Bug](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues) • [✨ Request Feature](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)

<img src="test-screenshots/02-file-uploaded.png" alt="PAV App Screenshot" width="800"/>

</div>

---

## 🌟 What is PAV?

A **zero-backend, client-side React application** for managing Physical Asset Verification (PAV) workflows. Upload Excel/CSV files, search and filter assets, edit details, and export updated data—all without a server!

### ✨ Key Features

- 📥 **Smart Import** - Drag & drop Excel (.xlsx) or CSV files
- 🔍 **Advanced Search** - Real-time search across all fields
- ✏️ **Inline Editing** - Update assets with validation rules
- 💾 **Auto-Save** - Changes persist in localStorage
- 📤 **Multi-Format Export** - Download as Excel or CSV
- 🎨 **Theme Toggle** - Beautiful dark/light modes
- ⚡ **Zero Backend** - 100% client-side, works offline
- 🚀 **Optimized** - Handles 1000+ assets smoothly

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+) & npm (v6+)

### Installation

```bash
# Clone the repository
git clone https://github.com/rohilkohli/pav-asset-verification-app-clean.git
cd pav-asset-verification-app-clean

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` and start managing assets! 🎉

### Production Build

```bash
npm run build
```

Deploy the `build/` folder to any static hosting (GitHub Pages, Netlify, Vercel, etc.)

---

## 📖 How It Works

<details>
<summary><b>1️⃣ Upload Asset Data</b> (Click to expand)</summary>

- Click **Upload** button or drag & drop your Excel/CSV file
- Supported formats: `.xlsx`, `.csv`
- Dates are automatically normalized to `YYYY-MM-DD`
- All data stays in your browser—nothing sent to servers

</details>

<details>
<summary><b>2️⃣ Search & Filter Assets</b></summary>

- **Search Bar**: Find assets by Serial Number, Asset Code, or Make
- **Filters**: Narrow down by Asset Type, Make, or PAV Status
- **Sorting**: Click column headers to sort
- Real-time results as you type

</details>

<details>
<summary><b>3️⃣ Edit Asset Details</b></summary>

- Click **Edit Details** on any asset card
- Update fields in the modal dialog
- **Validation Rules**:
  - "Other" remarks require a comment
  - Disposal vendor requires disposal ticket (auto-formatted as `RITMxxxxxxx`)
- Changes auto-save to localStorage

</details>

<details>
<summary><b>4️⃣ Export Updated Data</b></summary>

- Click **Download** button
- Choose Excel (.xlsx) or CSV format
- All edits are included in the export
- Use as backup or re-import later

</details>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Browser (Client-Side)          │
├─────────────────────────────────────────┤
│  Upload → Parse → State → Display       │
│     ↓        ↓        ↓        ↓        │
│  XLSX    SheetJS   Context  Components  │
│                      ↓                   │
│              localStorage (Persist)      │
│                      ↓                   │
│              ← Edit → Save → Export     │
└─────────────────────────────────────────┘
```

**Tech Stack**: React 18 • Material-UI v5 • SheetJS (XLSX) • Context API • localStorage

---

## 📁 Project Structure

```
pav-asset-verification-app-clean/
├── src/
│   ├── components/          # React components (memoized)
│   │   ├── AssetTable.jsx   # Main display & filtering
│   │   ├── EditModal.jsx    # Asset editing interface
│   │   ├── UploadForm.jsx   # File upload & parsing
│   │   ├── DownloadButton.jsx
│   │   ├── SearchBar.jsx
│   │   └── FilterBar.jsx
│   ├── context/
│   │   └── AssetContext.jsx # Global state management
│   ├── App.jsx              # Root component + theming
│   └── index.js             # App entry point
├── test-data/               # Sample Excel files for testing
├── public/                  # Static assets
└── package.json
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

Test suite includes:
- ✅ File upload & parsing
- ✅ Date normalization
- ✅ Filtering & sorting
- ✅ Validation rules

### Manual Testing

Use `test-data/Rohil_Kohli_2025_10_17.xlsx` to test:
1. Upload the sample file
2. Try search (e.g., search by Serial Number)
3. Apply filters (Asset Type, Make, Status)
4. Edit an asset and verify validation
5. Export data and compare

---

## 🌐 Deployment

### Deploy to GitHub Pages

**Option 1: Automatic (Recommended)**
```bash
git push origin main  # GitHub Actions auto-deploys
```

**Option 2: Manual**
```bash
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/pav-asset-verification-app-clean`

> **Note**: Update `homepage` in `package.json` with your repo URL

---

## ❓ FAQ

<details>
<summary><b>Do I need a backend server?</b></summary>

No! The app runs 100% in your browser. All data is stored locally using `localStorage`.

</details>

<details>
<summary><b>Is my data secure?</b></summary>

Yes. Your data **never leaves your computer**. Everything is processed locally.

</details>

<details>
<summary><b>What happens if I clear browser data?</b></summary>

Your asset data will be lost. Always **export regularly as backup**.

</details>

<details>
<summary><b>Can multiple users collaborate?</b></summary>

Currently no. Each browser has independent data. Consider adding a backend for multi-user support.

</details>

<details>
<summary><b>What's the maximum dataset size?</b></summary>

Optimized for 1000+ assets. Browser memory and localStorage (~5-10MB) are the main limits.

</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Guidelines**:
- Use React hooks and functional components
- Wrap new components with `React.memo` for performance
- Follow existing code style
- Test in both light and dark modes

---

## 🔒 Security & Privacy

- ✅ **Client-Side Only** - No server infrastructure
- ✅ **No Data Transmission** - Everything stays in your browser
- ✅ **No Tracking** - Zero analytics or third-party scripts
- ✅ **Open Source** - Fully transparent, inspect the code yourself

---

## 🐛 Known Limitations

- **Storage**: localStorage has ~5-10MB size limit
- **Performance**: Large datasets (>1000 assets) may slow filtering
- **Collaboration**: No multi-user support (single-browser only)
- **Offline**: Requires initial load; works offline afterward

*For enterprise use, consider adding a backend API.*

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📫 [Report Issues](https://github.com/rohilkohli/pav-asset-verification-app-clean/issues)
- ⭐ Star this repo if you find it useful!
- 🚀 Share with colleagues managing asset verification

---

<div align="center">

**Built with ❤️ using React and Material-UI**

[Live Demo](https://rohilkohli.github.io/pav-asset-verification-app-clean) • [Documentation](#documentation) • [GitHub](https://github.com/rohilkohli/pav-asset-verification-app-clean)

Made with 🚀 by developers, for asset managers everywhere.

© 2025 ROHIL KOHLI. All rights reserved.

</div>
