/**
 * RUNWAY1331 CHAOS MAP GENERATOR
 * 
 * PROPERTY LAYOUT:
 *   LEFT SIDE: Buildings 71-98 (Red Zone)
 *   MIDDLE: Reception desk + Fake plane
 *   RIGHT SIDE: Buildings 99-108 (Green Zone)
 * 
 * PROTOTYPE (4 groups, Red Zone only):
 *   Group A: Buildings 83, 84 → Northwest (top left)
 *   Group C: Buildings 85, 86 → Southwest (bottom left)
 *   Group B: Buildings 91, 92 → Northeast (top right)
 *   Group D: Buildings 93, 94 → Southeast (bottom right)
 */

class ChaosMapGenerator {
    
    constructor() {
        
        this.groups = {
            'A': {
                id: 'A',
                buildings: [83, 84],
                location: 'top-left',
                compass: 'NW',
                angle: 315,
                position: { x: 25, y: 25 },
                descriptionEN: 'Northwest corner - top left of Red Zone',
                descriptionTC: '西北角 - 紅區左上',
                descriptionSC: '西北角 - 红区左上',
                pathFromReception: 'Walk LEFT from reception, then toward the BACK. Look for the spinning sign in the middle of 4 buildings pointing Northwest.'
            },
            'C': {
                id: 'C',
                buildings: [85, 86],
                location: 'bottom-left',
                compass: 'SW',
                angle: 225,
                position: { x: 25, y: 75 },
                descriptionEN: 'Southwest corner - bottom left of Red Zone',
                descriptionTC: '西南角 - 紅區左下',
                descriptionSC: '西南角 - 红区左下',
                pathFromReception: 'Walk LEFT from reception, stay toward the FRONT. Look for the spinning sign in the middle of 4 buildings pointing Southwest.'
            },
            'B': {
                id: 'B',
                buildings: [91, 92],
                location: 'top-right',
                compass: 'NE',
                angle: 45,
                position: { x: 75, y: 25 },
                descriptionEN: 'Northeast corner - top right of Red Zone',
                descriptionTC: '東北角 - 紅區右上',
                descriptionSC: '东北角 - 红区右上',
                pathFromReception: 'Walk RIGHT from reception (past the plane), then toward the BACK. Look for the spinning sign in the middle of 4 buildings pointing Northeast.'
            },
            'D': {
                id: 'D',
                buildings: [93, 94],
                location: 'bottom-right',
                compass: 'SE',
                angle: 135,
                position: { x: 75, y: 75 },
                descriptionEN: 'Southeast corner - bottom right of Red Zone',
                descriptionTC: '東南角 - 紅區右下',
                descriptionSC: '东南角 - 红区右下',
                pathFromReception: 'Walk RIGHT from reception (past the plane), stay toward the FRONT. Look for the spinning sign in the middle of 4 buildings pointing Southeast.'
            }
        };

        this.buildingGroupMap = {};
        var self = this;
        Object.values(this.groups).forEach(function(group) {
            group.buildings.forEach(function(building) {
                self.buildingGroupMap[building] = group.id;
            });
        });

        this.landmarks = {
            reception: {
                id: 'reception',
                nameEN: 'Reception Desk',
                nameTC: '接待處',
                nameSC: '接待处',
                position: { x: 50, y: 50 }
            },
            plane: {
                id: 'plane',
                nameEN: 'Fake Plane',
                nameTC: '飛機模型',
                nameSC: '飞机模型',
                position: { x: 50, y: 42 }
            },
            spinningSign: {
                id: 'spinning-sign',
                nameEN: 'Spinning Direction Sign',
                nameTC: '旋轉指示牌',
                nameSC: '旋转指示牌',
                description: 'Scan QR code - sign will point to your building'
            }
        };
    }

    generateNavigation(buildingNumber) {
        
        var groupId = this.buildingGroupMap[buildingNumber];
        
        if (!groupId) {
            throw new Error(
                'Building ' + buildingNumber + ' is not in the prototype.\n' +
                'Prototype covers: A(83-84), C(85-86), B(91-92), D(93-94)'
            );
        }
        
        var group = this.groups[groupId];
        var passesPlane = group.location.includes('right');
        
        return {
            group: group.id,
            buildingNumber: buildingNumber,
            buildings: group.buildings,
            compass: group.compass,
            angle: group.angle,
            location: group.location,
            zone: 'red',
            zoneColor: '#C41E3A',
            
            gifFilename: 'group-' + group.id.toLowerCase() + '.gif',
            
            directionDisplay: group.descriptionEN + ' (' + group.compass + ')',
            pathInstructions: group.pathFromReception,
            
            visibleLandmarks: [
                this.landmarks.reception,
                ...(passesPlane ? [this.landmarks.plane] : []),
                this.landmarks.spinningSign
            ],
            
            pathSequence: this.generatePathSequence(group),
            
            textDirections: this.buildTextDirections(group, buildingNumber),
            
            qrCompass: group.compass,
            qrAngle: group.angle
        };
    }

    generatePathSequence(group) {
        var steps = [{ step: 1, type: 'start', location: 'Reception Desk' }];
        
        if (group.location.includes('right')) {
            steps.push({ step: 2, type: 'waypoint', location: 'Fake Plane (walk past it)' });
        }
        
        steps.push({
            step: steps.length + 1,
            type: 'direction',
            location: 'Walk ' + (group.location.includes('left') ? 'LEFT' : 'RIGHT') + ' toward the ' + (group.location.includes('top') ? 'BACK' : 'FRONT')
        });
        
        steps.push({
            step: steps.length + 1,
            type: 'landmark',
            location: 'Find the spinning sign in the middle of 4 buildings'
        });
        
        steps.push({
            step: steps.length + 1,
            type: 'end',
            location: 'Buildings ' + group.buildings.join(', ') + ' (' + group.compass + ')'
        });
        
        return steps;
    }

    buildTextDirections(group, buildingNumber) {
        return [
            '=== BUILDING ' + buildingNumber + ' - GROUP ' + group.id + ' (' + group.compass + ') ===',
            '',
            'FROM RECEPTION:',
            group.pathFromReception,
            '',
            'YOUR DIRECTION: ' + group.compass + ' (' + group.descriptionEN + ')',
            '',
            'AT THE BUILDINGS:',
            '- Find the spinning sign in the middle of 4 buildings',
            '- Scan the QR code for your group',
            '- Sign will point to your exact building',
            '',
            'LOST? Return to reception (middle of property, near the plane).'
        ].join('\n');
    }

    listRequiredGifs() {
        var self = this;
        return Object.values(this.groups).map(function(group) {
            return {
                filename: 'group-' + group.id.toLowerCase() + '.gif',
                group: group.id,
                buildings: group.buildings,
                compass: group.compass,
                description: 'Reception to Group ' + group.id + ' (' + group.compass + ')'
            };
        });
    }
}

module.exports = ChaosMapGenerator;
