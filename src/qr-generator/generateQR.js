/**
 * QR CODE GENERATOR FOR SPINNING SIGN
 * 
 * PHYSICAL SIGN BEHAVIOR:
 * - Sign reads QR code when guest scans it
 * - Sign spins to point in 1 of 8 compass directions
 * - Each QR code corresponds to a specific direction
 * 
 * PROTOTYPE: 4 building groups, 8 QR codes (4 active, 4 reserved)
 */

const fs = require('fs');
const path = require('path');

class QRGenerator {
    
    constructor(config = {}) {
        this.outputPath = config.outputPath || path.join(__dirname, '..', '..', 'examples', 'qr-codes');
        this.baseURL = config.baseURL || 'https://runway1331.com/navigate';
        
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }

        this.directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

        this.groupDirectionMap = {
            'A': {
                compass: 'NW',
                descriptionEN: 'Northwest - toward top left corner',
                descriptionTC: '西北方 - 向左上角',
                descriptionSC: '西北方 - 向左上角',
                signAngle: 315
            },
            'C': {
                compass: 'SW',
                descriptionEN: 'Southwest - toward bottom left corner',
                descriptionTC: '西南方 - 向左下角',
                descriptionSC: '西南方 - 向左下角',
                signAngle: 225
            },
            'B': {
                compass: 'NE',
                descriptionEN: 'Northeast - toward top right corner',
                descriptionTC: '東北方 - 向右上角',
                descriptionSC: '东北方 - 向右上角',
                signAngle: 45
            },
            'D': {
                compass: 'SE',
                descriptionEN: 'Southeast - toward bottom right corner',
                descriptionTC: '東南方 - 向右下角',
                descriptionSC: '东南方 - 向右下角',
                signAngle: 135
            }
        };
    }

    generateDirectionQR(direction, groupInfo = null) {
        
        const signCommand = {
            action: 'POINT',
            direction: direction,
            angle: this.getAngleForDirection(direction),
            group: groupInfo ? groupInfo.group : null,
            buildings: groupInfo ? groupInfo.buildings : [],
            displayText: groupInfo ? 
                'Group ' + groupInfo.group + ' Buildings ' + groupInfo.buildings.join(', ') :
                'Direction: ' + direction + ' (unused)'
        };

        const qrURL = groupInfo ?
            this.baseURL + '?direction=' + direction + '&group=' + groupInfo.group + '&buildings=' + groupInfo.buildings.join(',') :
            this.baseURL + '?direction=' + direction;

        const qrContent = JSON.stringify(signCommand);

        return {
            direction: direction,
            angle: signCommand.angle,
            group: signCommand.group,
            buildings: signCommand.buildings,
            qrURL: qrURL,
            qrContent: qrContent,
            filename: 'qr-direction-' + direction.toLowerCase() + '.png',
            label: groupInfo ?
                'GROUP ' + groupInfo.group + ' ' + direction + ' (Buildings ' + groupInfo.buildings.join(', ') + ')' :
                'UNUSED - ' + direction,
            signCommand: signCommand,
            isUsed: groupInfo !== null
        };
    }

    generateAllQRCodes() {
        
        var qrCodes = [];
        var self = this;
        
        this.directions.forEach(function(direction) {
            var groupEntry = Object.entries(self.groupDirectionMap).find(function(entry) {
                return entry[1].compass === direction;
            });
            
            var groupInfo = null;
            if (groupEntry) {
                var groupId = groupEntry[0];
                var groupData = groupEntry[1];
                groupInfo = {
                    group: groupId,
                    buildings: self.getBuildingsForGroup(groupId),
                    compass: groupData.compass,
                    descriptionEN: groupData.descriptionEN,
                    descriptionTC: groupData.descriptionTC,
                    descriptionSC: groupData.descriptionSC,
                    signAngle: groupData.signAngle
                };
            }
            
            qrCodes.push(self.generateDirectionQR(direction, groupInfo));
        });
        
        var configPath = path.join(this.outputPath, 'sign-config.json');
        fs.writeFileSync(configPath, JSON.stringify(qrCodes, null, 2));
        
        console.log('========================================');
        console.log('  SPINNING SIGN QR CODES');
        console.log('  8 Directions / 4 Active Groups');
        console.log('========================================\n');
        
        console.log('ACTIVE QR CODES (Prototype):');
        qrCodes.filter(function(q) { return q.isUsed; }).forEach(function(qr) {
            console.log('  ' + qr.direction + ' (' + qr.angle + 'deg) ' + qr.label);
        });
        
        console.log('\nRESERVED QR CODES (Future expansion):');
        qrCodes.filter(function(q) { return !q.isUsed; }).forEach(function(qr) {
            console.log('  ' + qr.direction + ' (' + qr.angle + 'deg) Unused');
        });
        
        console.log('\nConfig saved to: ' + configPath);
        console.log('QR codes ready for sign production.\n');
        
        return qrCodes;
    }

    getBuildingsForGroup(groupId) {
        var buildingMap = {
            'A': [83, 84],
            'C': [85, 86],
            'B': [91, 92],
            'D': [93, 94]
        };
        return buildingMap[groupId] || [];
    }

    getAngleForDirection(direction) {
        var angleMap = {
            'N': 0,
            'NE': 45,
            'E': 90,
            'SE': 135,
            'S': 180,
            'SW': 225,
            'W': 270,
            'NW': 315
        };
        return angleMap[direction] || 0;
    }

    getSignBehavior() {
        var self = this;
        return {
            type: 'SPINNING_SIGN_WITH_QR_READER',
            location: 'Center of 4 building groups',
            behavior: {
                idleState: 'Sign points UP (North) with all QR codes visible',
                onScan: 'Sign reads QR, extracts direction, spins to point that compass direction',
                completionState: 'Sign holds direction for 10 seconds, then returns to idle',
                errorState: 'If QR is unreadable, sign blinks red and returns to idle'
            },
            activeDirections: Object.entries(this.groupDirectionMap).map(function(entry) {
                return {
                    group: entry[0],
                    buildings: self.getBuildingsForGroup(entry[0]),
                    compass: entry[1].compass,
                    angle: entry[1].signAngle,
                    description: entry[1].descriptionEN
                };
            }),
            reservedDirections: this.directions.filter(function(d) {
                return !Object.values(self.groupDirectionMap).some(function(g) {
                    return g.compass === d;
                });
            })
        };
    }
}

module.exports = QRGenerator;
