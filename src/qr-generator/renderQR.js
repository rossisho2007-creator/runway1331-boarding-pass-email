/**
 * QR CODE IMAGE RENDERER
 * Generates actual QR code images (PNG/SVG) for email and physical sign
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class QRRenderer {
    
    constructor(config) {
        config = config || {};
        this.outputPath = config.outputPath || path.join(__dirname, '..', '..', 'examples', 'qr-codes');
        this.baseURL = config.baseURL || 'https://runway1331.com/navigate';
        
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
    }

    /**
     * Renders a single QR code as a data URL (for embedding in email)
     * @param {string} data - The data to encode
     * @returns {Promise<string>} Base64 data URL
     */
    async renderQRDataURL(data) {
        try {
            var dataURL = await QRCode.toDataURL(data, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#1A1A1A',
                    light: '#FFFFFF'
                }
            });
            return dataURL;
        } catch (err) {
            console.error('Error generating QR data URL:', err.message);
            return null;
        }
    }

    /**
     * Renders a QR code as SVG string (for email embedding)
     * @param {string} data - The data to encode
     * @returns {Promise<string>} SVG string
     */
    async renderQRSVG(data) {
        try {
            var svg = await QRCode.toString(data, {
                type: 'svg',
                width: 200,
                margin: 2,
                color: {
                    dark: '#1A1A1A',
                    light: '#FFFFFF'
                }
            });
            return svg;
        } catch (err) {
            console.error('Error generating QR SVG:', err.message);
            return null;
        }
    }

    /**
     * Renders and saves a QR code as PNG file
     * @param {string} data - The data to encode
     * @param {string} filename - Output filename
     * @returns {Promise<string>} Path to saved file
     */
    async renderAndSaveQR(data, filename) {
        try {
            var filePath = path.join(this.outputPath, filename);
            await QRCode.toFile(filePath, data, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#1A1A1A',
                    light: '#FFFFFF'
                }
            });
            return filePath;
        } catch (err) {
            console.error('Error saving QR code:', err.message);
            return null;
        }
    }

    /**
     * Generates all 8 QR codes (4 active + 4 reserved) and saves as PNG
     */
    async generateAllPrototypeQRs() {
        
        var qrCodes = [
            { direction: 'N',  angle: 0,   group: null,  buildings: [] },
            { direction: 'NE', angle: 45,  group: 'B',   buildings: [91, 92] },
            { direction: 'E',  angle: 90,  group: null,  buildings: [] },
            { direction: 'SE', angle: 135, group: 'D',   buildings: [93, 94] },
            { direction: 'S',  angle: 180, group: null,  buildings: [] },
            { direction: 'SW', angle: 225, group: 'C',   buildings: [85, 86] },
            { direction: 'W',  angle: 270, group: null,  buildings: [] },
            { direction: 'NW', angle: 315, group: 'A',   buildings: [83, 84] }
        ];
        
        var results = [];
        
        for (var i = 0; i < qrCodes.length; i++) {
            var qr = qrCodes[i];
            
            // Build the sign command that the QR encodes
            var signCommand = JSON.stringify({
                action: 'POINT',
                direction: qr.direction,
                angle: qr.angle,
                group: qr.group,
                buildings: qr.buildings
            });
            
            // Generate filename
            var filename = 'qr-direction-' + qr.direction.toLowerCase() + '.png';
            
            // Save PNG
            var savedPath = await this.renderAndSaveQR(signCommand, filename);
            
            // Generate data URL for email
            var dataURL = await this.renderQRDataURL(signCommand);
            
            results.push({
                direction: qr.direction,
                angle: qr.angle,
                group: qr.group,
                buildings: qr.buildings,
                filename: filename,
                filePath: savedPath,
                dataURL: dataURL,
                signCommand: signCommand,
                isActive: qr.group !== null
            });
            
            console.log('Generated: ' + filename + ' (' + qr.direction + ')' + 
                       (qr.group ? ' -> Group ' + qr.group : ' -> Unused'));
        }
        
        // Save results as JSON
        var resultsPath = path.join(this.outputPath, 'qr-codes-data.json');
        fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
        console.log('\nAll QR codes saved to: ' + this.outputPath);
        console.log('Data saved to: ' + resultsPath);
        
        return results;
    }

    /**
     * Gets the QR data URL for a specific building number
     * Used by the email system to embed the right QR code
     */
    async getQRForBuilding(buildingNumber, allQRCodes) {
        
        var buildingGroupMap = {
            83: 'A', 84: 'A',
            85: 'C', 86: 'C',
            91: 'B', 92: 'B',
            93: 'D', 94: 'D'
        };
        
        var groupDirectionMap = {
            'A': 'NW',
            'C': 'SW',
            'B': 'NE',
            'D': 'SE'
        };
        
        var group = buildingGroupMap[buildingNumber];
        var direction = groupDirectionMap[group];
        
        if (!direction || !allQRCodes) return null;
        
        var qrData = allQRCodes.find(function(qr) {
            return qr.direction === direction;
        });
        
        return qrData || null;
    }
}

module.exports = QRRenderer;
