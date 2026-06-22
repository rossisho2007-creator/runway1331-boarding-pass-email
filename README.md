# ✈️ Runway1331 Boarding Pass Email System

An aviation-themed email delivery system that sends guests a personalized "Boarding Pass" with an animated map, QR code for the spinning sign, and PIN code displayed as a "squawk code."

---

## The Problem

Guests arriving at Runway1331 struggle with navigation due to:
- No street names or building numbers (handwritten A4 paper only)
- Uniform architecture across buildings
- Only 1 staff member on duty
- 30+ guests getting lost daily

## The Solution

A fused wayfinding system:
- 🎨 **Aviation-themed email** with Runway1331 branding (white + fuchsia)
- 🗺️ **Animated GIF** showing path from reception to guest's building
- 🔢 **Squawk code PIN** for door access
- 📱 **QR code** that controls a physical spinning sign
- 🚨 **Staff Alert button** for lost guests
- 🌐 **Trilingual** (English, Traditional Chinese, Simplified Chinese)

---

## How It Works

### The Spinning Sign

8 QR codes, one per compass direction. The sign has a camera that reads the QR code from the guest's email, extracts the direction and angle, and a motor spins the sign to point the way.

| Direction | Angle | Buildings |
|-----------|-------|-----------|
| N | 0° | Reserved |
| NE | 45° | 91, 92 |
| E | 90° | 99–108 |
| SE | 135° | 93, 94 |
| S | 180° | 87–90, 95–98 |
| SW | 225° | 85, 86 |
| W | 270° | 71–78 |
| NW | 315° | 83, 84 |

---

## Project Structure

runway1331-boarding-pass/
├── src/
│ ├── email-templates/
│ │ ├── boarding-pass.html # Email HTML template
│ │ └── assets/
│ │ ├── logo.jpg # Runway1331 logo
│ │ └── gifs/ # Animated building GIFs
│ ├── email-service/
│ │ ├── sendEmail.js # Email builder
│ │ ├── templateEngine.js # Variable replacer
│ │ ├── logoEmbedder.js # Base64 logo embedding
│ │ └── gifEmbedder.js # Base64 GIF embedding
│ ├── gif-generator/
│ │ └── chaos-map-generator.js # Building → compass mapping
│ ├── pin-service/
│ │ ├── squawkCodeFormatter.js # PIN → squawk code
│ │ └── roomCodeGenerator.js # Random room codes (G01–G29)
│ ├── qr-generator/
│ │ ├── generateQR.js # QR data generator
│ │ └── renderQR.js # QR image renderer
│ ├── staff-alert/
│ │ └── alertService.js # Lost guest alerts
│ └── index.js # Main system
├── scripts/
│ ├── test-full-system.js # Test all 7 directions
│ ├── send-to-danica.js # Single guest test
│ └── generate-all-qrs.js # Generate QR PNGs
├── examples/
│ ├── sample-emails/ # Generated email previews
│ └── qr-codes/ # QR code PNGs + print sheet
├── docs/
│ └── email-design-system.md # Design specifications
└── data/
└── sample-guests.json # Test data

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm

### Installation
```bash
git clone https://github.com/rossisho2007-creator/runway1331-boarding-pass-email.git
cd runway1331-boarding-pass-email
npm install

## Generate Test Emails

node scripts/test-full-system.js
npx serve examples/sample-emails

## Generate QR Codes

node scripts/generate-all-qrs.js
npx serve examples/qr-codes