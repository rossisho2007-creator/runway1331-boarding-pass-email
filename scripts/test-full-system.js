var BoardingPassSystem = require('../src/index');
var fs = require('fs');
var path = require('path');

var system = new BoardingPassSystem({
    gifBaseUrl: 'https://runway1331.com/gifs'
});

// No room codes specified - system generates random ones
var testGuests = [
    { email: 'guest1@test.com', name: 'Emily Chen', buildingNumber: 83, checkInDate: '15 Dec 2024' },
    { email: 'guest2@test.com', name: 'James Wong', buildingNumber: 86, checkInDate: '15 Dec 2024' },
    { email: 'guest3@test.com', name: 'Sarah Li',   buildingNumber: 91, checkInDate: '16 Dec 2024' },
    { email: 'guest4@test.com', name: 'Mike Chan',   buildingNumber: 94, checkInDate: '16 Dec 2024' }
];

async function run() {
    console.log('============================================');
    console.log('  RUNWAY1331 BOARDING PASS - FULL TEST');
    console.log('  Random Room Codes + Random PINs');
    console.log('============================================\n');

    var emails = await system.processBatch(testGuests);

    emails.forEach(function(email, index) {
        var nav = email.navigation;
        var room = email.roomAssignment;
        console.log('GUEST ' + (index + 1) + ': ' + email.templateVars.guestName);
        console.log('  Room: ' + room.fullDisplay + ' (Floor ' + room.floor + ')');
        console.log('  Group: ' + nav.group + ' | Compass: ' + nav.compass + ' (' + nav.angle + 'deg)');
        console.log('  GIF: ' + nav.gifFilename);
        console.log('  QR: ' + (email.templateVars.qrDataURL ? 'YES' : 'NO'));
        console.log('  Squawk Code: ' + email.templateVars.squawkCode);
        console.log('');
    });

    var previewPath = path.join(__dirname, '..', 'examples', 'sample-emails', 'preview.html');
    fs.mkdirSync(path.dirname(previewPath), { recursive: true });
    fs.writeFileSync(previewPath, emails[0].html);

    console.log('Preview saved to: examples/sample-emails/preview.html');
    console.log('');
    console.log('Run again for different random room codes and PINs!');
}

run().catch(function(err) {
    console.error('Error:', err);
});
