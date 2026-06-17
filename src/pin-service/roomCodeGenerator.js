/**
 * ROOM CODE GENERATOR
 * Format: BuildingNumber - RoomCode (e.g., "083 - G02")
 * Floors: 1 (G01-G09), 2 (G10-G19), 3 (G21-G29)
 */

class RoomCodeGenerator {
    
    constructor() {
        this.floorRanges = {
            1: { min: 1,  max: 9,  prefix: 'G0' },
            2: { min: 10, max: 19, prefix: 'G'  },
            3: { min: 21, max: 29, prefix: 'G'  }
        };
        
        // All available buildings
        this.allBuildings = [71, 83, 84, 85, 86, 90, 91, 92, 93, 94, 99];
    }

    generateRoomCode(floor) {
        floor = floor || this.randomFloor();
        var range = this.floorRanges[floor];
        if (!range) throw new Error('Invalid floor: ' + floor);
        var roomNum = this.randomInt(range.min, range.max);
        return floor === 1 ? 'G0' + roomNum : 'G' + roomNum;
    }

    generateRoomAssignment(buildingNumber, floor) {
        floor = floor || this.randomFloor();
        var roomCode = this.generateRoomCode(floor);
        return {
            buildingNumber: buildingNumber,
            roomCode: roomCode,
            floor: floor,
            fullDisplay: buildingNumber + ' - ' + roomCode,
            buildingDisplay: String(buildingNumber).padStart(3, '0'),
            label: String(buildingNumber).padStart(3, '0') + ' - ' + roomCode
        };
    }

    getRandomBuilding() {
        return this.allBuildings[this.randomInt(0, this.allBuildings.length - 1)];
    }

    randomFloor() { return this.randomInt(1, 3); }
    randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
}

module.exports = RoomCodeGenerator;
