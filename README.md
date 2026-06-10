# Runway1331 Boarding Pass Email System

An aviation-themed email delivery system that sends guests a personalized "Boarding Pass" with an animated path map (GIF) and PIN code displayed as a "squawk code."

## What We're Building
- ✈️ Aviation-themed responsive HTML email template
- 🗺️ Personalized animated GIF showing path from reception to guest's door
- 🔢 PIN delivery system formatted as aviation squawk codes
- 🔌 Integration-ready PIN generation (TBA door system)

## Current Phase
Email design and delivery system with manual/templated GIFs. Door system integration is TBA (they haven't installed the new doors yet).

### Future Phase
Programmatic GIF generation and real-time door system API integration.

## Project Structure
runway1331-boarding-pass/
├── docs/ # Design system & documentation
├── src/
│ ├── email-templates/ # HTML email designs
│ ├── email-service/ # Email sending logic
│ ├── gif-generator/ # Animated map creation
│ └── pin-service/ # PIN generation & formatting
├── design-assets/ # Figma exports & design files
├── tests/ # Testing files
└── examples/ # Sample outputs

## Design Inspirations

### The Silveri (MGallery) - Tung Chung
- Aviation luxury design language
- Boarding pass/passport-style artifacts
- Subtle, sophisticated aviation theming

### K11 Artus - Tsim Sha Tsui  
- Digital "Arrival Guide" with custom property illustration
- Architectural map showing tower, lift lobby, mall relationship
- Bespoke design delivered pre-arrival

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- An email testing service account (Litmus/Email on Acid recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/runway1331-boarding-pass.git

# Navigate to project
cd runway1331-boarding-pass

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your .env with email service credentials

# Run email template preview server
npm run dev

# Test email sending (development mode)
npm run send:test

# Generate sample GIF
npm run gif:generate