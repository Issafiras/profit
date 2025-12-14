# Technical Specification
## Salgsanalyse Dashboard

**Version:** 1.1  
**Dato:** December 2025  
**Forfatter:** Teknisk Team  

---

## 1. System Overview

### 1.1 Architecture
Salgsanalyse Dashboard er en client-side only webapplikation bygget med moderne web teknologier. Systemet behandler alle data lokalt i browseren uden server-side komponenter.

**Arkitektur Principper:**
- Zero server dependencies efter første load
- Browser-native APIs udelukkende
- Progressive enhancement
- Graceful degradation

### 1.2 Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Frontend Framework** | Vanilla JavaScript | ES6+ | Core logic & DOM manipulation |
| **UI Framework** | HTML5 | - | Semantic structure |
| **Styling** | Tailwind CSS | CDN | Responsive design |
| **Data Processing** | PapaParse | 5.4.1 | CSV parsing & validation |
| **Build System** | None | - | Static files only |
| **Deployment** | GitHub Pages | - | Static hosting |

---

## 2. Data Processing Pipeline

### 2.1 Input Data Format
Systemet accepterer CSV filer med følgende karakteristika:

**Fil krav:**
- Format: CSV (Comma Separated Values)
- Encoding: UTF-8 eller ISO-8859-1 (Latin-1)
- Maksimal størrelse: 50MB
- Linjeender: CRLF eller LF

**Forventede Kolonner:**
```javascript
// Primære kolonner (case-insensitive)
const expectedColumns = {
  productName: ['Varenavn', 'Varetekst.', 'Varetekst'],
  salesPrice: ['Udpris', 'udpris'],
  costPrice: ['GnSKost', 'GnsKost', 'gnskost'],
  inventory: ['Disp.beh', 'disp.beh']
};
```

### 2.2 Data Processing Flow

#### Stage 1: File Upload & Validation
```javascript
function validateFile(file) {
  // Type checking
  if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
    throw new Error('Invalid file type');
  }

  // Size checking
  if (file.size > 50 * 1024 * 1024) { // 50MB
    throw new Error('File too large');
  }

  return true;
}
```

#### Stage 2: CSV Parsing
```javascript
const parseConfig = {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: false, // Keep as strings for custom parsing
  transformHeader: (header) => header.trim(),
  complete: (results) => processData(results.data),
  error: (error) => handleParseError(error)
};
```

#### Stage 3: Danish Number Parsing
```javascript
function parseDanishNumber(input) {
  if (!input || typeof input !== 'string') return 0;

  // Handle Danish format: "5.376,43" -> 5376.43
  const cleaned = input
    .replace(/\./g, '')    // Remove thousand separators
    .replace(',', '.');    // Convert decimal comma to dot

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
```

#### Stage 4: Business Logic Calculations
```javascript
function calculateMetrics(row) {
  const salesPrice = parseDanishNumber(row['Udpris']);
  const costPrice = parseDanishNumber(row['GnSKost'] || row['GnsKost']);

  // Skip dummy data
  if (salesPrice === 99999 || salesPrice === 9999) {
    return null;
  }

  // Calculate real revenue (excluding VAT)
  const realRevenue = salesPrice / 1.25;

  // Calculate real profit
  const realProfit = realRevenue - costPrice;

  return {
    productName: row['Varenavn'] || row['Varetekst.'] || 'Unknown',
    inventory: parseInt(row['Disp.beh']) || 0,
    salesPrice: salesPrice,
    costPrice: costPrice,
    realRevenue: realRevenue,
    realProfit: realProfit
  };
}
```

#### Stage 5: Data Filtering & Analysis

**Cash Cows Algorithm:**
```javascript
function findCashCows(data) {
  return data
    .filter(item => !isNaN(item.realProfit))
    .sort((a, b) => b.realProfit - a.realProfit)
    .slice(0, 10);
}
```

**Lager-Guld Algorithm:**
```javascript
function findLagerGuld(data) {
  return data
    .filter(item =>
      item.inventory > 10 &&
      item.realProfit > 50 &&
      !isNaN(item.realProfit)
    )
    .sort((a, b) => b.inventory - a.inventory);
}
```

**Tabs-liste Algorithm:**
```javascript
function findTabsListe(data) {
  return data
    .filter(item =>
      item.realProfit < 0 &&
      !isNaN(item.realProfit)
    )
    .sort((a, b) => a.realProfit - b.realProfit); // Most negative first
}
```

---

## 3. User Interface Components

### 3.1 File Upload Component

**HTML Structure:**
```html
<div id="uploadZone" class="drop-zone">
  <div class="upload-icon">
    <svg>...</svg>
  </div>
  <h3>Upload din tele.csv fil</h3>
  <p>Træk og slip filen her, eller klik for at vælge</p>
  <input type="file" id="fileInput" accept=".csv" hidden>
  <button onclick="document.getElementById('fileInput').click()">
    Vælg fil
  </button>
</div>
```

**JavaScript Logic:**
```javascript
class FileUploadHandler {
  constructor(uploadZone, fileInput) {
    this.uploadZone = uploadZone;
    this.fileInput = fileInput;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Drag and drop events
    this.uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
    this.uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.uploadZone.addEventListener('drop', this.handleDrop.bind(this));

    // Click to select
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
  }

  handleDragOver(e) {
    e.preventDefault();
    this.uploadZone.classList.add('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    this.uploadZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }
}
```

### 3.2 Data Tables Component

**Responsive Table Structure:**
```html
<div class="table-container">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Varenavn
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Lagerantal
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Fortjeneste
        </th>
      </tr>
    </thead>
    <tbody id="tableBody" class="bg-white divide-y divide-gray-200">
      <!-- Dynamic rows inserted here -->
    </tbody>
  </table>
</div>
```

**Dynamic Row Generation:**
```javascript
function createTableRow(item) {
  const row = document.createElement('tr');

  const profitClass = item.realProfit >= 0 ? 'profit-positive' : 'profit-negative';
  const profitFormatted = formatCurrency(item.realProfit);

  row.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      ${escapeHtml(item.productName)}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${item.inventory}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm ${profitClass}">
      ${profitFormatted}
    </td>
  `;

  return row;
}
```

### 3.3 Search Functionality

**Real-time Search Implementation:**
```javascript
class TableSearch {
  constructor(tableBody, searchInput) {
    this.tableBody = tableBody;
    this.searchInput = searchInput;
    this.originalRows = [];
    this.filteredRows = [];

    this.setupSearch();
  }

  setupSearch() {
    this.searchInput.addEventListener('input', this.handleSearch.bind(this));
  }

  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (!searchTerm) {
      this.showAllRows();
      return;
    }

    this.filteredRows = this.originalRows.filter(row => {
      const productName = row.cells[0].textContent.toLowerCase();
      return productName.includes(searchTerm);
    });

    this.renderFilteredRows();
  }

  showAllRows() {
    this.tableBody.innerHTML = '';
    this.originalRows.forEach(row => this.tableBody.appendChild(row));
  }

  renderFilteredRows() {
    this.tableBody.innerHTML = '';
    this.filteredRows.forEach(row => this.tableBody.appendChild(row));
  }
}
```

---

## 4. Performance Optimizations

### 4.1 Memory Management
```javascript
class DataManager {
  constructor() {
    this.rawData = null;
    this.processedData = null;
    this.maxRows = 50000; // Limit for performance
  }

  processLargeDataset(data) {
    if (data.length > this.maxRows) {
      console.warn(`Dataset truncated to ${this.maxRows} rows for performance`);
      data = data.slice(0, this.maxRows);
    }

    // Process in chunks to avoid blocking UI
    return this.processInChunks(data, 1000);
  }

  processInChunks(data, chunkSize) {
    const results = [];
    let index = 0;

    const processChunk = () => {
      const chunk = data.slice(index, index + chunkSize);
      const processedChunk = chunk.map(row => this.processRow(row));

      results.push(...processedChunk);
      index += chunkSize;

      if (index < data.length) {
        // Schedule next chunk asynchronously
        setTimeout(processChunk, 0);
      } else {
        // All chunks processed
        this.onProcessingComplete(results);
      }
    };

    processChunk();
  }
}
```

### 4.2 UI Responsiveness
```javascript
class UIManager {
  constructor() {
    this.loadingStates = new Map();
  }

  showLoading(elementId, message = 'Behandler data...') {
    const element = document.getElementById(elementId);
    const loadingId = `loading-${elementId}`;

    if (this.loadingStates.has(loadingId)) return;

    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-sm text-gray-600">${message}</span>
      </div>
    `;

    element.appendChild(loadingDiv);
    this.loadingStates.set(loadingId, true);
  }

  hideLoading(elementId) {
    const loadingId = `loading-${elementId}`;
    const loadingDiv = document.getElementById(loadingId);

    if (loadingDiv) {
      loadingDiv.remove();
      this.loadingStates.delete(loadingId);
    }
  }
}
```

---

## 5. Error Handling & Validation

### 5.1 Input Validation
```javascript
const ValidationRules = {
  file: {
    type: (file) => file.type.includes('csv') || file.name.endsWith('.csv'),
    size: (file) => file.size <= 50 * 1024 * 1024, // 50MB
    content: async (file) => {
      // Check if file contains expected CSV structure
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const hasExpectedColumns = this.validateCSVStructure(content);
          resolve(hasExpectedColumns);
        };
        reader.readAsText(file);
      });
    }
  },

  data: {
    requiredColumns: ['Varenavn', 'Udpris', 'GnSKost', 'Disp.beh'],
    numericFields: ['Udpris', 'GnSKost', 'Disp.beh'],
    danishNumberFormat: /^-?\d{1,3}(\.\d{3})*,\d{2}$/
  }
};
```

### 5.2 Error Recovery
```javascript
class ErrorHandler {
  static handleFileError(error, fileName) {
    const errorMessages = {
      'Invalid file type': 'Vælg venligst en CSV-fil',
      'File too large': 'Filen er for stor (maks 50MB)',
      'Invalid CSV structure': 'CSV-filen mangler nødvendige kolonner',
      'Parse error': 'Kunne ikke læse CSV-filen'
    };

    const message = errorMessages[error.message] || 'Ukendt fejl opstod';
    this.showErrorMessage(message);
  }

  static showErrorMessage(message) {
    // Create and show error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
}
```

---

## 6. Browser Compatibility

### 6.1 Supported Browsers
| Browser | Minimum Version | Support Level |
|---------|----------------|---------------|
| Chrome | 80+ | Full support |
| Firefox | 75+ | Full support |
| Safari | 13+ | Full support |
| Edge | 80+ | Full support |
| iOS Safari | 13+ | Full support |
| Chrome Android | 80+ | Full support |

### 6.2 Feature Detection
```javascript
const BrowserSupport = {
  check() {
    const features = {
      fileAPI: 'File' in window && 'FileReader' in window,
      dragDrop: 'dragenter' in document.createElement('div'),
      promises: typeof Promise !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      es6: () => {
        try {
          new Function('(a = 1) => a');
          return true;
        } catch (e) {
          return false;
        }
      }
    };

    const results = {};
    for (const [feature, test] of Object.entries(features)) {
      results[feature] = typeof test === 'function' ? test() : test;
    }

    return results;
  },

  showCompatibilityWarning() {
    const support = this.check();
    const unsupported = Object.entries(support)
      .filter(([, supported]) => !supported)
      .map(([feature]) => feature);

    if (unsupported.length > 0) {
      console.warn('Browser compatibility issues:', unsupported);
      // Show user-friendly warning
      this.displayWarning(`
        Din browser understøtter ikke alle funktioner.
        Overvej at opdatere til en nyere version af Chrome, Firefox eller Safari.
      `);
    }
  }
};
```

---

## 7. Security Considerations

### 7.1 Client-Side Security
- **No Data Transmission:** All data processing happens locally
- **No External APIs:** Zero network requests after initial page load
- **No Cookies/Storage:** No persistent data storage
- **Content Security Policy:** Restrictive CSP headers recommended

### 7.2 Data Privacy
- **GDPR Compliance:** No personal data collection
- **Data Retention:** Data exists only in browser memory
- **Export Prevention:** No automatic data export features
- **Clear Data Option:** User can clear all data with one click

### 7.3 Input Sanitization
```javascript
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}
```

---

## 8. Testing Specifications

### 8.1 Unit Tests
```javascript
// Example test suite
describe('Data Processing', () => {
  test('parseDanishNumber handles valid formats', () => {
    expect(parseDanishNumber('5.376,43')).toBe(5376.43);
    expect(parseDanishNumber('123,45')).toBe(123.45);
    expect(parseDanishNumber('0,00')).toBe(0);
  });

  test('parseDanishNumber handles invalid formats', () => {
    expect(parseDanishNumber('')).toBe(0);
    expect(parseDanishNumber('abc')).toBe(0);
    expect(parseDanishNumber(null)).toBe(0);
  });

  test('calculateMetrics computes correct profit', () => {
    const row = {
      'Varenavn': 'Test Product',
      'Udpris': '125,00', // 125 DKK including 25% VAT
      'GnSKost': '75,00',
      'Disp.beh': '10'
    };

    const result = calculateMetrics(row);

    expect(result.realRevenue).toBe(100); // 125 / 1.25
    expect(result.realProfit).toBe(25); // 100 - 75
  });
});
```

### 8.2 Performance Benchmarks
- **CSV Parsing:** < 10 seconds for 10,000 rows
- **Data Processing:** < 5 seconds for 50,000 rows
- **UI Rendering:** < 2 seconds for large datasets
- **Memory Usage:** < 100MB peak for large files

### 8.3 Cross-Browser Testing Matrix
- Manual testing on all supported browsers
- Automated visual regression testing
- Performance testing across devices
- Accessibility testing with screen readers

---

## 9. Deployment & Maintenance

### 9.1 Build Process
```bash
# No build process - static files only
# Just copy files to web server
cp index.html /var/www/html/
cp instruktions.md /var/www/html/
cp PRD_*.md /var/www/html/
```

### 9.2 CDN Dependencies
- **Tailwind CSS:** `https://cdn.tailwindcss.com`
- **PapaParse:** `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`

### 9.3 Version Control
```json
{
  "version": "1.1.0",
  "lastUpdated": "2025-12-14",
  "changes": [
    "Added support for multiple column names",
    "Improved Danish number parsing",
    "Enhanced error handling",
    "Added search functionality"
  ]
}
```

---

## 10. Future Enhancements

### 10.1 Planned Features
- **Data Export:** CSV/Excel export af resultater
- **Chart Visualizations:** Grafisk visning af trends
- **Multi-file Support:** Sammenligning af flere perioder
- **Advanced Filtering:** Custom filter kriterier

### 10.2 Technical Improvements
- **Service Worker:** Offline caching
- **WebAssembly:** Performance boost for large datasets
- **Web Components:** Modular UI components
- **Progressive Web App:** Installable version

### 10.3 Integration Options
- **API Integration:** Connection to existing systems
- **Database Storage:** Persistent data storage
- **Real-time Updates:** Live data synchronization
- **Multi-user Support:** Shared dashboards

---

*Technical Specification Version 1.1 - December 2025*