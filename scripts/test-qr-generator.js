var QRGenerator = require('../src/qr-generator/generateQR');

var qrGen = new QRGenerator({
    baseURL: 'https://runway1331.com/navigate'
});

console.log('========================================');
console.log('  RUNWAY1331 QR CODE GENERATOR');
console.log('  Prototype: 8 Directions, 4 Active');
console.log('========================================\n');

var qrCodes = qrGen.generateAllQRCodes();

console.log('\n--- SIGN BEHAVIOR ---');
var behavior = qrGen.getSignBehavior();
console.log(JSON.stringify(behavior, null, 2));

console.log('\nAll QR configurations generated successfully!');
