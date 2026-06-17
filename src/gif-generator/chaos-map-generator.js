/**
 * RUNWAY1331 CHAOS MAP GENERATOR
 * 
 * PROPERTY LAYOUT:
 *   LEFT SIDE: Buildings 83-86
 *   RIGHT SIDE: Buildings 91-94
 *   MIDDLE: Reception desk + Fake plane
 * 
 * CURRENT BUILDINGS: 83, 84, 85, 86, 91, 92, 93, 94
 * Each building has its own GIF
 */

class ChaosMapGenerator {
    
    constructor() {
        
        // Direct building-to-GIF mapping (no groups)
        this.buildings = {
            83: {
                buildingNumber: 83,
                compass: 'NW',
                angle: 315,
                location: 'top-left',
                descriptionEN: 'Northwest - top left area',
                descriptionTC: '西北 - 左上區域',
                descriptionSC: '西北 - 左上区域',
                pathFromReception: 'Walk LEFT from reception, then toward the BACK.'
            },
            84: {
                buildingNumber: 84,
                compass: 'NW',
                angle: 315,
                location: 'top-left',
                descriptionEN: 'Northwest - top left area',
                descriptionTC: '西北 - 左上區域',
                descriptionSC: '西北 - 左上区域',
                pathFromReception: 'Walk LEFT from reception, then toward the BACK.'
            },
            85: {
                buildingNumber: 85,
                compass: 'SW',
                angle: 225,
                location: 'bottom-left',
                descriptionEN: 'Southwest - bottom left area',
                descriptionTC: '西南 - 左下區域',
                descriptionSC: '西南 - 左下区域',
                pathFromReception: 'Walk LEFT from reception, stay toward the FRONT.'
            },
            86: {
                buildingNumber: 86,
                compass: 'SW',
                angle: 225,
                location: 'bottom-left',
                descriptionEN: 'Southwest - bottom left area',
                descriptionTC: '西南 - 左下區域',
                descriptionSC: '西南 - 左下区域',
                pathFromReception: 'Walk LEFT from reception, stay toward the FRONT.'
            },
            91: {
                buildingNumber: 91,
                compass: 'NE',
                angle: 45,
                location: 'top-right',
                descriptionEN: 'Northeast - top right area',
                descriptionTC: '東北 - 右上區域',
                descriptionSC: '东北 - 右上区域',
                pathFromReception: 'Walk RIGHT from reception (past the plane), then toward the BACK.'
            },
            92: {
                buildingNumber: 92,
                compass: 'NE',
                angle: 45,
                location: 'top-right',
                descriptionEN: 'Northeast - top right area',
                descriptionTC: '東北 - 右上區域',
                descriptionSC: '东北 - 右上区域',
                pathFromReception: 'Walk RIGHT from reception (past the plane), then toward the BACK.'
            },
            93: {
                buildingNumber: 93,
                compass: 'SE',
                angle: 135,
                location: 'bottom-right',
                descriptionEN: 'Southeast - bottom right area',
                descriptionTC: '東南 - 右下區域',
                descriptionSC: '东南 - 右下区域',
                pathFromReception: 'Walk RIGHT from reception (past the plane), stay toward the FRONT.'
            },
            94: {
                buildingNumber: 94,
                compass: 'SE',
                angle: 135,
                location: 'bottom-right',
                descriptionEN: 'Southeast - bottom right area',
                descriptionTC: '東南 - 右下區域',
                descriptionSC: '东南 - 右下区域',
                pathFromReception: 'Walk RIGHT from reception (past the plane), stay toward the FRONT.'
            }
        };

        this.landmarks = {
            reception: {
                id: 'reception',
                nameEN: 'Reception Desk',
                nameTC: '接待處',
                nameSC: '接待处'
            },
            plane: {
                id: 'plane',
                nameEN: 'Fake Plane',
                nameTC: '飛機模型',
                nameSC: '飞机模型'
            },
            spinningSign: {
                id: 'spinning-sign',
                nameEN: 'Spinning Direction Sign',
                nameTC: '旋轉指示牌',
                nameSC: '旋转指示牌'
            }
        };
    }

    generateNavigation(buildingNumber) {
        
        var building = this.buildings[buildingNumber];
        
        if (!building) {
            throw new Error(
                'Building ' + buildingNumber + ' not found. ' +
                'Available: 83, 84, 85, 86, 91, 92, 93, 94'
            );
        }
        
        var passesPlane = building.location.includes('right');
        
        return {
            buildingNumber: building.buildingNumber,
            compass: building.compass,
            angle: building.angle,
            location: building.location,
            zone: 'red',
            zoneColor: '#C41E3A',
            
            // Each building has its own GIF now
            gifFilename: 'building-' + buildingNumber + '.gif',
            
            directionDisplay: building.descriptionEN + ' (' + building.compass + ')',
            pathInstructions: building.pathFromReception,
            
            visibleLandmarks: [
                this.landmarks.reception,
                ...(passesPlane ? [this.landmarks.plane] : []),
                this.landmarks.spinningSign
            ],
            
            pathSequence: this.generatePathSequence(building),
            textDirections: this.buildTextDirections(building),
            
            qrCompass: building.compass,
            qrAngle: building.angle
        };
    }

    generatePathSequence(building) {
        var steps = [{ step: 1, type: 'start', location: 'Reception Desk' }];
        
        if (building.location.includes('right')) {
            steps.push({ step: 2, type: 'waypoint', location: 'Fake Plane (walk past it)' });
        }
        
        steps.push({
            step: steps.length + 1,
            type: 'direction',
            location: 'Walk ' + (building.location.includes('left') ? 'LEFT' : 'RIGHT') + 
                     ' toward the ' + (building.location.includes('top') ? 'BACK' : 'FRONT')
        });
        
        steps.push({
            step: steps.length + 1,
            type: 'end',
            location: 'Building ' + building.buildingNumber + ' (' + building.compass + ')'
        });
        
        return steps;
    }

    buildTextDirections(building) {
        return [
            '=== BUILDING ' + building.buildingNumber + ' (' + building.compass + ') ===',
            '',
            'FROM RECEPTION:',
            building.pathFromReception,
            '',
            'Look for the spinning sign and scan the QR code in your email.',
            'Building number on front, room code on back.',
            '',
            'LOST? Return to reception (middle of property, near the plane).'
        ].join('\n');
    }

    listAllBuildings() {
        return Object.keys(this.buildings).map(Number);
    }
}

module.exports = ChaosMapGenerator;
