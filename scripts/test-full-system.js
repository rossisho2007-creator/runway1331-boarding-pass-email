var BoardingPassSystem = require('../src/index');
var fs = require('fs');
var path = require('path');

var system = new BoardingPassSystem();

// One test guest per compass direction
var testGuests = [
    { email: 'test-nw@runway1331.com', name: 'NW Guest', buildingNumber: 83, checkInDate: '17 June 2026' },
    { email: 'test-ne@runway1331.com', name: 'NE Guest', buildingNumber: 91, checkInDate: '17 June 2026' },
    { email: 'test-e@runway1331.com',  name: 'East Guest', buildingNumber: 99, checkInDate: '17 June 2026' },
    { email: 'test-se@runway1331.com', name: 'SE Guest', buildingNumber: 94, checkInDate: '17 June 2026' },
    { email: 'test-s@runway1331.com',  name: 'South Guest', buildingNumber: 90, checkInDate: '17 June 2026' },
    { email: 'test-sw@runway1331.com', name: 'SW Guest', buildingNumber: 86, checkInDate: '17 June 2026' },
    { email: 'test-w@runway1331.com',  name: 'West Guest', buildingNumber: 71, checkInDate: '17 June 2026' },
];

async function run() {
    console.log('============================================');
    console.log('  RUNWAY1331 - ALL 7 DIRECTIONS TEST');
    console.log('============================================\n');

    var emails = await system.processBatch(testGuests);

    emails.forEach(function(email, index) {
        var nav = email.navigation;
        var room = email.roomAssignment;
        console.log('GUEST ' + (index + 1) + ': ' + email.templateVars.guestName);
        console.log('  Room: ' + room.fullDisplay + ' (Floor ' + room.floor + ')');
        console.log('  Compass: ' + nav.compass + ' (' + nav.angle + 'deg)');
        console.log('  GIF: ' + nav.gifFilename);
        console.log('  QR: ' + (email.templateVars.qrDataURL ? 'EMBEDDED' : 'MISSING'));
        console.log('  Squawk: ' + email.templateVars.squawkCode);
        console.log('');
    });

    // Save all previews
    var previewDir = path.join(__dirname, '..', 'examples', 'sample-emails');
    fs.mkdirSync(previewDir, { recursive: true });

    emails.forEach(function(email) {
        var filename = 'preview-building-' + email.navigation.buildingNumber + '.html';
        fs.writeFileSync(path.join(previewDir, filename), email.html);
        console.log('Saved: ' + filename);
    });

    console.log('\nAll 7 direction emails generated!');
}

run().catch(function(err) {
    console.error('Error:', err.message);
});
