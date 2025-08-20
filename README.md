# Transcript Platform

A comprehensive platform for comparing audio and video transcription vendors, featuring detailed analysis of features, pricing, capabilities, and affiliate programs.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Convert data and start development server
npm run dev
```

## 📊 Data Overview

- **25 transcription vendors** with comprehensive scoring and analysis
- **25 affiliate programs** with commission structures and compliance data
- **Real-time data processing** from CSV to optimized TypeScript

## 🔧 Available Commands

```bash
# Data Processing
npm run convert:data          # Convert vendor CSV to JSON
npm run convert:affiliates    # Convert affiliate CSV to JSON
npm run build:data           # Compile JSON to TypeScript
npm run prebuild             # Run all data conversion steps

# Development
npm run dev                  # Start development server
npm run build               # Build for production
npm run start               # Start production server

# Validation
npm run validate:data       # Validate vendor data
npm run validate:affiliates # Validate affiliate data
npm run type-check          # TypeScript type checking
```

## 🏗️ Architecture

- **Data Pipeline**: CSV → JSON → TypeScript → Next.js
- **Build-time Processing**: Static data compilation for performance
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Nested Data**: Rich data structures with CSV-friendly notation

## 📁 Project Structure

```
avtranscript/
├── data/           # Raw CSV data files
├── lib/            # Core types and validators
├── scripts/        # Data processing pipeline
├── pages/          # Next.js application pages
├── components/     # React components
└── docs/           # Detailed documentation
```

## 🌐 Access

- **Development**: http://localhost:3000
- **Build Output**: Optimized static pages with Next.js

## 📚 Documentation

- **Design.md** - Detailed architecture and technical design
- **NestedFields.md** - Data structure and nested field strategy
- **VendorsExtended.md** - Future data model expansion plans

---

*Built with Next.js, TypeScript, and a robust data processing pipeline.*
