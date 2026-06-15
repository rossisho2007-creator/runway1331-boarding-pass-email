var BoardingPassSystem = require('../src/index');
var fs = require('fs');
var path = require('path');

var system = new BoardingPassSystem({
    gifBaseUrl: 'https://runway1331.com/gifs'
});

async function run() {
    console.log('Generating boarding pass for Danica Wong...\n');
    
    var result = await system.processGuest({
        email: 'danica@example.com',
        name: 'Danica Wong',
        buildingNumber: 91,
        roomCode: 'G29',
        checkInDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    
    var nav = result.navigation;
    var room = result.roomAssignment;
    
    console.log('========================================');
    console.log('  BOARDING PASS READY');
    console.log('========================================');
    console.log('Guest:    Danica Wong');
    console.log('Room:     ' + room.fullDisplay + ' (Floor ' + room.floor + ')');
    console.log('Group:    ' + nav.group + ' | Compass: ' + nav.compass);
    console.log('Subject:  ' + result.subject);
    console.log('Squawk:   ' + result.templateVars.squawkCode);
    console.log('QR:       ' + (result.templateVars.qrDataURL ? 'Embedded' : 'None'));
    console.log('Logo:     ' + (result.templateVars.logoUrl.indexOf('data:image') === 0 ? 'Embedded' : 'URL'));
    console.log('========================================\n');
    
    // Save HTML
    var filePath = path.join(__dirname, '..', 'examples', 'sample-emails', 'danica-wong.html');
    fs.writeFileSync(filePath, result.html);
    console.log('HTML saved to: examples/sample-emails/danica-wong.html');
    console.log('');
    console.log('TO SEND THIS EMAIL:');
    console.log('1. Go to https://putsmail.com/templates');
    console.log('2. Copy the HTML from the file above');
    console.log('3. Paste it into Putsmail');
    console.log('4. Enter danica@example.com as recipient');
    console.log('5. Click Send\n');
}

run().catch(function(err) {
    console.error('Error:', err.message);
});
