/**
 * ROOM CODE GENERATOR
 * Based on Runway1331's actual naming pattern:
 * - Floor 1: G01 - G09
 * - Floor 2: G10 - G19
 * - Floor 3: G21 - G29
 * 
 * Format: BuildingNumber - RoomCode (e.g., "083 - G02")
 */

class RoomCodeGenerator {
    
    constructor() {
        // Floor ranges based on property knowledge
        this.floorRanges = {
            1: { min: 1,  max: 9,  prefix: 'G0' },  // G01 - G09
            2: { min: 10, max: 19, prefix: 'G'  },  // G10 - G19
            3: { min: 21, max: 29, prefix: 'G'  }   // G21 - G29
        };
    }

    /**
     * Generates a random room code for a given floor
     * @param {number} floor - 1, 2, or 3
     * @returns {string} Room code (e.g., "G07", "G15", "G24")
     */
    generateRoomCode(floor) {
        floor = floor || this.randomFloor();
        var range = this.floorRanges[floor];
        
        if (!range) {
            throw new Error('Invalid floor: ' + floor + '. Must be 1, 2, or 3.');
        }
        
        var roomNum = this.randomInt(range.min, range.max);
        
        if (floor === 1) {
            return 'G0' + roomNum;
        } else {
            return 'G' + roomNum;
        }
    }

    /**
     * Generates a full room identifier
     * @param {number} buildingNumber - Building number
     * @param {number} floor - Floor number (optional, random if not provided)
     * @returns {object} { buildingNumber, roomCode, floor, fullDisplay }
     */
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

    /**
     * Returns a random floor (1-3)
     */
    randomFloor() {
        return this.randomInt(1, 3);
    }

    /**
     * Returns a random integer between min and max (inclusive)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Returns all possible room codes for a given floor
     * Useful for staff to see available rooms
     */
    getAllRoomCodesForFloor(floor) {
        var range = this.floorRanges[floor];
        if (!range) return [];
        
        var codes = [];
        for (var i = range.min; i <= range.max; i++) {
            if (floor === 1) {
                codes.push('G0' + i);
            } else {
                codes.push('G' + i);
            }
        }
        return codes;
    }

    /**
     * Returns all rooms across all floors
     */
    getAllRoomCodes() {
        var allRooms = [];
        for (var floor = 1; floor <= 3; floor++) {
            var rooms = this.getAllRoomCodesForFloor(floor);
            rooms.forEach(function(code) {
                allRooms.push({ floor: floor, code: code });
            });
        }
        return allRooms;
    }
}

module.exports = RoomCodeGenerator;
