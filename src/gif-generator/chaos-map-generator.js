/**
 * RUNWAY1331 CHAOS MAP GENERATOR
 * 8 compass directions for spinning sign
 */

class ChaosMapGenerator {
    
    constructor() {
        
        this.buildings = {
            // Northwest (315deg) - Top Left
            83: { compass: 'NW', angle: 315, description: 'Northwest - top left' },
            84: { compass: 'NW', angle: 315, description: 'Northwest - top left' },
            // Southwest (225deg) - Bottom Left
            85: { compass: 'SW', angle: 225, description: 'Southwest - bottom left' },
            86: { compass: 'SW', angle: 225, description: 'Southwest - bottom left' },
            // Northeast (45deg) - Top Right
            91: { compass: 'NE', angle: 45, description: 'Northeast - top right' },
            92: { compass: 'NE', angle: 45, description: 'Northeast - top right' },
            // Southeast (135deg) - Bottom Right
            93: { compass: 'SE', angle: 135, description: 'Southeast - bottom right' },
            94: { compass: 'SE', angle: 135, description: 'Southeast - bottom right' },
            // West (270deg) - Left side
            71: { compass: 'W', angle: 270, description: 'West - left side' },
            72: { compass: 'W', angle: 270, description: 'West - left side' },
            73: { compass: 'W', angle: 270, description: 'West - left side' },
            74: { compass: 'W', angle: 270, description: 'West - left side' },
            75: { compass: 'W', angle: 270, description: 'West - left side' },
            76: { compass: 'W', angle: 270, description: 'West - left side' },
            77: { compass: 'W', angle: 270, description: 'West - left side' },
            78: { compass: 'W', angle: 270, description: 'West - left side' },
            // East (90deg) - Right side
            99: { compass: 'E', angle: 90, description: 'East - right side' },
            100: { compass: 'E', angle: 90, description: 'East - right side' },
            101: { compass: 'E', angle: 90, description: 'East - right side' },
            102: { compass: 'E', angle: 90, description: 'East - right side' },
            103: { compass: 'E', angle: 90, description: 'East - right side' },
            104: { compass: 'E', angle: 90, description: 'East - right side' },
            105: { compass: 'E', angle: 90, description: 'East - right side' },
            106: { compass: 'E', angle: 90, description: 'East - right side' },
            107: { compass: 'E', angle: 90, description: 'East - right side' },
            108: { compass: 'E', angle: 90, description: 'East - right side' },
            // South (180deg) - Bottom
            87: { compass: 'S', angle: 180, description: 'South - bottom' },
            88: { compass: 'S', angle: 180, description: 'South - bottom' },
            89: { compass: 'S', angle: 180, description: 'South - bottom' },
            90: { compass: 'S', angle: 180, description: 'South - bottom' },
            95: { compass: 'S', angle: 180, description: 'South - bottom' },
            96: { compass: 'S', angle: 180, description: 'South - bottom' },
            97: { compass: 'S', angle: 180, description: 'South - bottom' },
            98: { compass: 'S', angle: 180, description: 'South - bottom' }
        };
    }

    generateNavigation(buildingNumber) {
        
        var building = this.buildings[buildingNumber];
        
        if (!building) {
            throw new Error('Building ' + buildingNumber + ' not found.');
        }
        
        return {
            buildingNumber: buildingNumber,
            compass: building.compass,
            angle: building.angle,
            gifFilename: 'building-' + buildingNumber + '.gif',
            description: building.description
        };
    }
}

module.exports = ChaosMapGenerator;
