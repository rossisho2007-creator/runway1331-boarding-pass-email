/**
 * Email Service
 * Runway1331 Boarding Pass Email System
 * 
 * Contact Info:
 *   General: info@runway1331.com.hk
 *   Reservations: +852 5635 7131 / rsvn@runway1331.com.hk
 *   Address: Shing Fung Rd, Kai Tak, Hong Kong
 */

const SquawkCodeFormatter = require('../pin-service/squawkCodeFormatter');

class EmailService {
    
    constructor(config) {
        config = config || {};
        this.provider = config.provider || 'sendgrid';
        this.fromEmail = config.fromEmail || 'rsvn@runway1331.com.hk';
        this.fromName = config.fromName || 'Runway1331';
        this.checkInTime = config.checkInTime || '15:00';
        this.logoUrl = config.logoUrl || 'https://runway1331.com/logo.png';
        this.replyTo = config.replyTo || 'rsvn@runway1331.com.hk';
        this.contactPhone = config.contactPhone || '+852 5635 7131';
        this.contactEmail = config.contactEmail || 'info@runway1331.com.hk';
        this.address = config.address || 'Shing Fung Rd, Kai Tak, Hong Kong';
    }

    buildChaosEmail(guest) {
        
        var squawkVars = SquawkCodeFormatter.getEmailVariables(guest.pin);
        var nav = guest.navigation;
        var roomCode = guest.roomCode || 'G01';
        var buildingDisplay = nav.buildingNumber + ' - ' + roomCode + ' (Group ' + nav.group + ')';
        
        var templateVars = {
            logoUrl: this.logoUrl,
            guestName: guest.name,
            checkInDate: guest.checkInDate || 'Today',
            checkInTime: this.checkInTime,
            buildingBlock: buildingDisplay,
            buildingNumber: nav.buildingNumber,
            roomCode: roomCode,
            
            compass: nav.compass,
            angle: nav.angle,
            zone: nav.zone,
            zoneColor: nav.zoneColor,
            squawkCode: squawkVars.squawkCode,
            gifUrl: guest.gifUrl,
            validityPeriod: squawkVars.validityPeriod,
            pathInstructions: nav.pathInstructions,
            directionDisplay: nav.directionDisplay,
            qrDataURL: guest.qrDataURL || '',
            qrDirection: guest.qrDirection || '',
            contactPhone: this.contactPhone,
            contactEmail: this.contactEmail,
            address: this.address
        };

        return {
            to: guest.email,
            from: this.fromName + ' <' + this.fromEmail + '>',
            replyTo: this.replyTo,
            subject: 'Your Runway1331 Boarding Pass - ' + nav.buildingNumber + ' - ' + roomCode + ' (Group ' + nav.group + ')',
            templateVars: templateVars,
            text: this.buildPlainTextVersion(templateVars)
        };
    }

    buildPlainTextVersion(vars) {
        return [
            '=== RUNWAY1331 BOARDING PASS ===',
            '',
            'Guest: ' + vars.guestName,
            'Date: ' + vars.checkInDate,
            'Building: ' + vars.buildingNumber + ' - ' + vars.roomCode,
            'Group: ' + vars.group + ' (' + vars.compass + ')',
            '',
            'YOUR SQUAWK CODE: ' + vars.squawkCode,
            '',
            'Find the spinning sign and scan the QR code.',
            'Sign will point to Group ' + vars.group + '.',
            'Building number on front, room code on back.',
            '',
            '---',
            'Runway1331',
            'Shing Fung Rd, Kai Tak, Hong Kong',
            'Tel/WhatsApp: +852 5635 7131',
            'Email: rsvn@runway1331.com.hk',
            '---',
            '',
            'Need assistance? Reply to this email or call us.'
        ].join('\n');
    }

    send(emailPayload) {
        console.log('Email ready to send:', {
            to: emailPayload.to,
            subject: emailPayload.subject,
            from: emailPayload.from
        });
        return {
            success: true,
            message: 'Email prepared',
            to: emailPayload.to
        };
    }
}

module.exports = EmailService;
