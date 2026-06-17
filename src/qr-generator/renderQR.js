/**
 * QR CODE IMAGE RENDERER
 * Generates actual QR code PNGs for physical sign
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class QRRenderer {
    
    constructor(config) {
        config = config || {};
        this.outputPath = config.outputPath || path.join(__dirname, '..', '..', 'examples', 'qr-codes');
        
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }

    async renderQRDataURL(data) {
        try {
            return await QRCode.toDataURL(data, {
                width: 200,
                margin: 2,
                color: { dark: '#1A1A1A', light: '#FFFFFF' }
            });
        } catch (err) {
            console.error('QR data URL error:', err.message);
            return null;
        }
    }

    async renderAndSaveQR(data, filename) {
        try {
            var filePath = path.join(this.outputPath, filename);
            await QRCode.toFile(filePath, data, {
                width: 300,
                margin: 2,
                color: { dark: '#1A1A1A', light: '#FFFFFF' }
            });
            return filePath;
        } catch (err) {
            console.error('QR save error:', err.message);
            return null;
        }
    }

    async generateAllPrototypeQRs() {
        
        var qrCodes = [
            { direction: 'N',  angle: 0,   buildings: [] },
            { direction: 'NE', angle: 45,  buildings: [91, 92] },
            { direction: 'E',  angle: 90,  buildings: [99, 108] },
            { direction: 'SE', angle: 135, buildings: [93, 94] },
            { direction: 'S',  angle: 180, buildings: [87, 90, 95, 98] },
            { direction: 'SW', angle: 225, buildings: [85, 86] },
            { direction: 'W',  angle: 270, buildings: [71, 78] },
            { direction: 'NW', angle: 315, buildings: [83, 84] }
        ];
        
        var results = [];
        
        for (var i = 0; i < qrCodes.length; i++) {
            var qr = qrCodes[i];
            
            var signCommand = JSON.stringify({
                action: 'POINT',
                direction: qr.direction,
                angle: qr.angle,
                buildings: qr.buildings
            });
            
            var filename = 'qr-direction-' + qr.direction.toLowerCase() + '.png';
            
            await this.renderAndSaveQR(signCommand, filename);
            var dataURL = await this.renderQRDataURL(signCommand);
            
            results.push({
                direction: qr.direction,
                angle: qr.angle,
                buildings: qr.buildings,
                filename: filename,
                dataURL: dataURL,
                signCommand: signCommand,
                isActive: qr.buildings.length > 0
            });
            
            console.log('Generated: ' + filename + ' (' + qr.direction + ')');
        }
        
        var resultsPath = path.join(this.outputPath, 'qr-codes-data.json');
        fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
        console.log('\nSaved to: ' + this.outputPath);
        
        return results;
    }

    async getQRForBuilding(buildingNumber, allQRCodes) {
        
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
        if (!direction || !allQRCodes) return null;
        
        return allQRCodes.find(function(qr) {
            return qr.direction === direction;
        }) || null;
    }
}

module.exports = QRRenderer;
