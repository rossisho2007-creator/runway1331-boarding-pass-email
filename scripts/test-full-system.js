/**
 * Full system test - simulates processing multiple guests
 */

const BoardingPassSystem = require('../src/index');
const fs = require('fs');
const path = require('path');

// Load sample guests
const sampleData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'sample-guests.json'), 'utf-8')
);

// Initialize system
const system = new BoardingPassSystem({
    gifBaseUrl: 'https://runway1331.com/gifs',
    fromEmail: 'checkin@runway1331.com',
    fromName: 'Runway1331'
});

console.log('============================================');
console.log('  RUNWAY1331 BOARDING PASS - FULL TEST');
console.log('============================================\n');

// Process all guests
const emails = system.processBatch(sampleData.guests);

emails.forEach((email, index) => {
    console.log(`GUEST ${index + 1}: ${email.templateVars.guestName}`);
    console.log(`  Subject: ${email.subject}`);
    console.log(`  Building: ${email.templateVars.buildingNumber}`);
    console.log(`  Zone: ${email.templateVars.zone}`);
    console.log(`  Squawk Code: ${email.templateVars.squawkCode}`);
    console.log(`  GIF: ${email.templateVars.gifUrl}`);
    console.log(`  HTML Length: ${email.html.length} characters`);
    console.log('');
});

// Save first email HTML for preview
const previewPath = path.join(__dirname, '..', 'examples', 'sample-emails', 'preview.html');
fs.mkdirSync(path.dirname(previewPath), { recursive: true });
fs.writeFileSync(previewPath, emails[0].html);

console.log('Preview saved to: examples/sample-emails/preview.html');
console.log('Open this file in a browser to see the email design!\n');
console.log('Test complete!');
