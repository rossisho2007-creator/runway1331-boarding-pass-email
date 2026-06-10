/**
 * GIF Path Generator
 * Maps guest building numbers to zone-based animated map GIFs
 */

const path = require('path');
const fs = require('fs');

// Building-to-zone mapping (14 zones covering buildings 71-98)
const BUILDING_ZONE_MAP = {
    71: 'A', 72: 'A',
    73: 'B', 74: 'B',
    75: 'C', 76: 'C',
    77: 'D', 78: 'D',
    79: 'E', 80: 'E',
    81: 'F', 82: 'F',
    83: 'G', 84: 'G',
    85: 'H', 86: 'H',
    87: 'I', 88: 'I',
    89: 'J', 90: 'J',
    91: 'K', 92: 'K',
    93: 'L', 94: 'L',
    95: 'M', 96: 'M',
    97: 'N', 98: 'N'
};

class GifGenerator {
    
    constructor() {
        this.templatesPath = path.join(__dirname, 'building-templates');
    }

    /**
     * Gets the zone GIF for a guest's building number
     * @param {number} buildingNumber - Building number (71-98)
     * @returns {object} { zone, filename, path }
     */
    getGifForBuilding(buildingNumber) {
        
        const zone = BUILDING_ZONE_MAP[buildingNumber];
        
        if (!zone) {
            console.warn(`Building ${buildingNumber} not in zone map, using default`);
            return {
                zone: 'default',
                filename: 'default.gif',
                path: path.join(this.templatesPath, 'default.gif')
            };
        }
        
        const filename = `zone-${zone.toLowerCase()}.gif`;
        const filePath = path.join(this.templatesPath, filename);
        
        return {
            zone: zone,
            filename: filename,
            path: filePath
        };
    }

    /**
     * Lists all available zone templates
     * @returns {string[]} Array of zone identifiers
     */
    listAvailableZones() {
        const files = fs.readdirSync(this.templatesPath);
        return files
            .filter(f => f.startsWith('zone-') && f.endsWith('.gif'))
            .map(f => f.replace('zone-', '').replace('.gif', '').toUpperCase());
    }
}

module.exports = GifGenerator;
