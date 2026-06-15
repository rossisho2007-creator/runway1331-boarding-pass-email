var QRRenderer = require('../src/qr-generator/renderQR');

var renderer = new QRRenderer();

console.log('========================================');
console.log('  GENERATING 8 QR CODES');
console.log('  4 Active + 4 Reserved');
console.log('========================================\n');

renderer.generateAllPrototypeQRs().then(function(results) {
    console.log('\nDone! QR codes ready.');
    console.log('Active QR codes:');
    results.filter(function(r) { return r.isActive; }).forEach(function(r) {
        console.log('  ' + r.direction + ' -> Group ' + r.group + ' (Buildings ' + r.buildings.join(', ') + ')');
    });
}).catch(function(err) {
    console.error('Error:', err.message);
});
