/**
 * Runway1331 Boarding Pass System
 */

const EmailService = require('./email-service/sendEmail');
const ChaosMapGenerator = require('./gif-generator/chaos-map-generator');
const SquawkCodeFormatter = require('./pin-service/squawkCodeFormatter');
const RoomCodeGenerator = require('./pin-service/roomCodeGenerator');
const TemplateEngine = require('./email-service/templateEngine');
const StaffAlertService = require('./staff-alert/alertService');
const QRRenderer = require('./qr-generator/renderQR');
const fs = require('fs');
const path = require('path');

class BoardingPassSystem {
    
    constructor(config) {
        config = config || {};
        this.emailService = new EmailService({
            logoUrl: config.logoUrl || 'https://runway1331.com/logo.png'
        });
        this.chaosMap = new ChaosMapGenerator();
        this.templateEngine = new TemplateEngine();
        this.staffAlert = new StaffAlertService({
            alertEmail: config.alertEmail || 'rsvn@runway1331.com.hk'
        });
        this.qrRenderer = new QRRenderer();
        this.roomGenerator = new RoomCodeGenerator();
        this.gifBaseUrl = config.gifBaseUrl || 'https://runway1331.com/gifs';
        
        this.qrCodes = null;
        var qrDataPath = path.join(__dirname, '..', 'examples', 'qr-codes', 'qr-codes-data.json');
        if (fs.existsSync(qrDataPath)) {
            this.qrCodes = JSON.parse(fs.readFileSync(qrDataPath, 'utf-8'));
        }
    }

    async processGuest(guest) {
        
        // Generate PIN (random unless provided)
        var pin = guest.pin || SquawkCodeFormatter.generatePin();
        
        // Generate room code (random unless provided)
        var roomAssignment;
        if (guest.roomCode) {
            roomAssignment = {
                buildingNumber: guest.buildingNumber,
                roomCode: guest.roomCode,
                floor: guest.floor || 1,
                fullDisplay: guest.buildingNumber + ' - ' + guest.roomCode,
                buildingDisplay: String(guest.buildingNumber).padStart(3, '0'),
                label: String(guest.buildingNumber).padStart(3, '0') + ' - ' + guest.roomCode
            };
        } else {
            roomAssignment = this.roomGenerator.generateRoomAssignment(
                guest.buildingNumber,
                guest.floor || null
            );
        }
        
        // Get navigation data
        var navigation = this.chaosMap.generateNavigation(guest.buildingNumber);
        
        // Get QR code for this building
        var qrData = null;
        if (this.qrCodes) {
            qrData = await this.qrRenderer.getQRForBuilding(guest.buildingNumber, this.qrCodes);
        }
        
        // Build email
        var email = this.emailService.buildChaosEmail({
            email: guest.email,
            name: guest.name,
            pin: pin,
            gifUrl: this.gifBaseUrl + '/' + navigation.gifFilename,
            navigation: navigation,
            checkInDate: guest.checkInDate || 'Today',
            roomCode: roomAssignment.roomCode,
            qrDataURL: qrData ? qrData.dataURL : null,
            qrDirection: qrData ? qrData.direction : null
        });
        
        email.html = this.templateEngine.render('boarding-pass', email.templateVars);
        email.navigation = navigation;
        email.qrData = qrData;
        email.roomAssignment = roomAssignment;
        
        return email;
    }

    async processBatch(guests) {
        var results = [];
        for (var i = 0; i < guests.length; i++) {
            results.push(await this.processGuest(guests[i]));
        }
        return results;
    }

    handleLostGuest(guestInfo) {
        return this.staffAlert.createLostGuestAlert(guestInfo);
    }
}

module.exports = BoardingPassSystem;
