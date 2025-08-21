# Transcript Platform

A comprehensive vendor comparison platform for transcription services.

## Data Overview
- **25 Vendors**: Complete profiles with pricing, capabilities, and performance metrics
- **25 Affiliate Programs**: Commission structures and compliance information
- **Real-time Data**: Automated CSV → JSON → TypeScript pipeline

## Quick Start
```bash
npm install
npm run prebuild  # Process data files
npm run dev       # Start development server
```

## Data Pipeline
The platform uses a build-time data processing pipeline:
1. **CSV Sources**: Raw vendor and affiliate data
2. **JSON Processing**: Validation and enrichment
3. **TypeScript Output**: Type-safe, compiled data models

## Architecture
- **Next.js 14**: App Router with TypeScript
- **Tailwind CSS**: Utility-first styling
- **Zod Validation**: Runtime type safety
- **Build-time Processing**: CSV → JSON → TS compilation

## Development
```bash
npm run prebuild    # Process CSV data
npm run build       # Build production app
npm run dev         # Development server
npm run lint        # Code quality checks
```

## Project Structure
```
avtranscript/
├── data/           # CSV source files
├── lib/            # Generated TypeScript data
├── components/     # React components
├── pages/          # Next.js pages
└── scripts/        # Data processing scripts
```

## Data Models
- **Vendors**: Company info, pricing, capabilities, scoring
- **Affiliates**: Program details, commissions, compliance
- **Validation**: Automated quality checks and confidence scoring

## Contributing
1. Update CSV files in `data/` directory
2. Run `npm run prebuild` to regenerate TypeScript
3. Test changes with `npm run dev`
4. Submit pull request with updated data

## License
MIT License - see LICENSE file for details


**Version**: 0.1  
**Date**: August 2025
**Copyright**: 2025 Transcript Developers

~  
