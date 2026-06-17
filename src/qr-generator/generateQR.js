/**
 * QR CODE GENERATOR FOR SPINNING SIGN
 * 8 directions, each QR tells the sign which way to point
 */

const fs = require('fs');
const path = require('path');

class QRGenerator {
    
    constructor(config) {
        config = config || {};
        this.outputPath = config.outputPath || path.join(__dirname, '..', '..', 'examples', 'qr-codes');
        
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }

        // All 8 compass directions with their building assignments
        this.directionMap = {
            'N':  { angle: 0,   buildings: [],       group: null,  description: 'North - Reserved' },
            'NE': { angle: 45,  buildings: [91, 92],  group: 'B',   description: 'Northeast - Buildings 91-92' },
            'E':  { angle: 90,  buildings: [99, 108], group: 'E',   description: 'East - Buildings 99-108' },
            'SE': { angle: 135, buildings: [93, 94],  group: 'D',   description: 'Southeast - Buildings 93-94' },
            'S':  { angle: 180, buildings: [87, 90, 95, 98], group: 'S', description: 'South - Buildings 87-90, 95-98' },
            'SW': { angle: 225, buildings: [85, 86],  group: 'C',   description: 'Southwest - Buildings 85-86' },
            'W':  { angle: 270, buildings: [71, 78],  group: 'W',   description: 'West - Buildings 71-78' },
            'NW': { angle: 315, buildings: [83, 84],  group: 'A',   description: 'Northwest - Buildings 83-84' }
        };
    }

    generateQRData(direction) {
        
        var data = this.directionMap[direction];
        if (!data) return null;
        
        // This is what the sign's Raspberry Pi reads
        var signCommand = {
            action: 'POINT',
            direction: direction,
            angle: data.angle,
            buildings: data.buildings,
            description: data.description
        };
        
        // URL for web fallback (if scanned with phone instead of sign)
        var qrURL = 'https://runway1331.com/navigate?direction=' + direction + '&angle=' + data.angle;
        
        if (data.buildings.length > 0) {
            qrURL += '&buildings=' + data.buildings.join(',');
        }
        
        return {
            direction: direction,
            angle: data.angle,
            buildings: data.buildings,
            description: data.description,
            signCommand: JSON.stringify(signCommand),
            qrURL: qrURL,
            filename: 'qr-direction-' + direction.toLowerCase() + '.png',
            isActive: data.buildings.length > 0
        };
    }

    generateAllQRData() {
        var self = this;
        var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        var results = [];
        
        directions.forEach(function(dir) {
            results.push(self.generateQRData(dir));
        });
        
        var configPath = path.join(this.outputPath, 'sign-config.json');
        fs.writeFileSync(configPath, JSON.stringify(results, null, 2));
        
        console.log('========================================');
        console.log('  SPINNING SIGN QR CODES - 8 DIRECTIONS');
        console.log('========================================\n');
        
        console.log('ACTIVE (with buildings):');
        results.filter(function(r) { return r.isActive; }).forEach(function(r) {
            console.log('  ' + r.direction + ' (' + r.angle + 'deg) - ' + r.description);
        });
        
        console.log('\nRESERVED:');
        results.filter(function(r) { return !r.isActive; }).forEach(function(r) {
            console.log('  ' + r.direction + ' (' + r.angle + 'deg) - Reserved');
        });
        
        console.log('\nConfig saved to: ' + configPath);
        
        return results;
    }

    getQRByDirection(direction) {
        return this.generateQRData(direction);
    }

    getQRByBuilding(buildingNumber) {
        var buildingDirectionMap = {
            83: 'NW', 84: 'NW',
            85: 'SW', 86: 'SW',
            91: 'NE', 92: 'NE',
            93: 'SE', 94: 'SE',
            71: 'W', 72: 'W', 73: 'W', 74: 'W', 75: 'W', 76: 'W', 77: 'W', 78: 'W',
            99: 'E', 100: 'E', 101: 'E', 102: 'E', 103: 'E', 104: 'E', 105: 'E', 106: 'E', 107: 'E', 108: 'E',
            87: 'S', 88: 'S', 89: 'S', 90: 'S',
            95: 'S', 96: 'S', 97: 'S', 98: 'S'
        };
        
        var direction = buildingDirectionMap[buildingNumber];
        if (!direction) return null;
        
        return this.generateQRData(direction);
    }
}

module.exports = QRGenerator;
