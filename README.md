# Transcript Platform

A comprehensive vendor comparison platform for transcription services with progressive enhancement and complexity level management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Development Workflow

### Core Commands
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build production app
npm run start        # Start production server
npm run type-check   # TypeScript type checking
```

### Data Processing (Recommended)
```bash
npm run convert      # Process all CSV data (vendors + affiliates)
npm run compile      # Compile JSON data to TypeScript
npm run validate     # Validate all data integrity
```

### Data Processing (Individual)
```bash
npm run convert:vendors     # Process vendor CSV only (debugging)
npm run convert:affiliates  # Process affiliate CSV only (debugging)
npm run validate:vendors    # Validate vendor data only (debugging)
npm run validate:affiliates # Validate affiliate data only (debugging)
```

### Build System
```bash
npm run prebuild    # Smart data processing before build
npm run rebuild     # Force rebuild everything (troubleshooting)
```

### Testing & Validation
```bash
# Manual testing
npm run dev          # Start server
curl http://localhost:3000/site     # Test main site
curl http://localhost:3000/complexity-demo  # Test complexity system

# Automated testing (if configured)
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🧪 Testing Flows

### 1. Site Functionality Testing
```bash
# Start development server
npm run dev

# Test main site endpoints
curl -s http://localhost:3000/site | grep -o "Professional Transcription Services\|25.*Services\|Complexity\|Compare Services"
curl -s http://localhost:3000/site | grep -o "Services with API Integration\|Real-time Processing Available\|Data Confidence"
```

### 2. Complexity Level System Testing
```bash
# Test complexity demo
curl -s http://localhost:3000/complexity-demo | grep -o "Basic\|Standard\|Advanced\|Complexity Level"

# Test progressive enhancement
curl -s http://localhost:3000/progressive-demo | grep -o "Basic\|Responsive\|Enhanced"
```

### 3. Component Testing
```bash
# Test individual components
curl -s http://localhost:3000/site | grep -o "VendorCard\|ProfessionalSearch\|VendorComparison"
```

### 4. Data Integration Testing
```bash
# Verify vendor data loading
curl -s http://localhost:3000/site | grep -o "Rev\|Descript\|Sonix\|Trint\|Otter.ai"
```

## 🔧 Development Operations

### Adding New Vendors
1. Update `data/vendors.csv` with new vendor data
2. Run `npm run convert` to process CSV data
3. Run `npm run validate` to ensure data integrity
4. Run `npm run dev` to test changes
5. Verify vendor appears in site with correct complexity level

### Modifying Complexity Levels
1. Edit `utils/complexity/config.ts` for level definitions
2. Update `types/complexity/index.ts` for type changes
3. Modify components in `components/vendor/` as needed
4. Test with `npm run dev` and visit `/complexity-demo`

### Adding New Components
1. Create component in appropriate `components/` subdirectory
2. Export from `components/index.ts`
3. Import and use in relevant pages
4. Test with `npm run dev`

### Debugging Common Issues
```bash
# Check for import path issues
grep -r "import.*ComplexityProvider" components/ pages/

# Verify file structure
ls -la components/vendor/ providers/ hooks/ types/ utils/

# Check for build errors
npm run build 2>&1 | grep -i error

# Check data processing
npm run validate  # Validate data integrity
npm run type-check  # Check TypeScript errors
```

## 📁 Key Directories

- **`components/`** - React components (vendor cards, search, comparison)
- **`providers/`** - React context providers (ComplexityProvider)
- **`hooks/`** - Custom React hooks (complexity, display context)
- **`types/`** - TypeScript type definitions
- **`utils/`** - Configuration and utility functions
- **`lib/`** - Core data and types (vendors, validation)
- **`pages/`** - Next.js pages and routing

## 🚨 Troubleshooting

### Import Path Errors
```bash
# Fix common import path issues
# Wrong: import { ComplexityProvider } from '../components/providers/ComplexityProvider'
# Right: import { ComplexityProvider } from '../providers/ComplexityProvider'
```

### Server Won't Start
```bash
# Check for port conflicts
lsof -i :3000
# Kill conflicting process
kill -9 <PID>

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Data Not Loading
```bash
# Verify data files exist
ls -la lib/data/
# Check for TypeScript errors
npm run type-check
# Validate data integrity
npm run validate
# Reprocess data if needed
npm run convert
```

## 📊 Performance Monitoring

```bash
# Monitor build performance
time npm run build

# Check bundle size
npm run build && du -sh .next/static/chunks/

# Monitor development server
npm run dev
# Watch for compilation times in terminal output
```

## 🔄 Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy (platform specific)
# Vercel: vercel --prod
# Netlify: netlify deploy --prod
# Docker: docker build -t transcript-platform .
```

---

**Version**: 1.0  
**Date**: August 2025  
**Copyright**: 2025 Transcript Developers

---

## **Recent Improvements**

### **Command Structure & Data Pipeline**
- **Default Commands**: `convert`, `compile`, `validate` for normal operations
- **Smart Caching**: Automatic data processing only when CSV files change
- **Dependency Management**: Automatic processing order (vendors → affiliates → compile)
- **Consistent Naming**: Script files follow `{action}-{target}.ts` pattern

~  
