/**
 * Email Service
 * Handles sending boarding pass emails with zone-based GIFs
 */

const SquawkCodeFormatter = require('../pin-service/squawkCodeFormatter');

class EmailService {
    
    constructor(config = {}) {
        this.provider = config.provider || 'sendgrid';
        this.fromEmail = config.fromEmail || 'checkin@runway1331.com';
        this.fromName = config.fromName || 'Runway1331';
        this.checkInTime = config.checkInTime || '15:00';
        this.logoUrl = config.logoUrl || 'https://runway1331.com/logo.png';
    }

    /**
     * Builds the boarding pass email payload
     * @param {object} guest - Guest information
     * @returns {object} Email payload
     */
    buildBoardingPassEmail(guest) {
        
        const squawkVars = SquawkCodeFormatter.getEmailVariables(guest.pin);
        const buildingDisplay = `Building ${guest.buildingNumber} (Zone ${guest.zone})`;
        
        const templateVars = {
            logoUrl: this.logoUrl,
            guestName: guest.name,
            checkInDate: guest.checkInDate,
            checkInTime: this.checkInTime,
            buildingBlock: buildingDisplay,
            buildingNumber: guest.buildingNumber,
            zone: guest.zone,
            squawkCode: squawkVars.squawkCode,
            gifUrl: guest.gifUrl,
            validityPeriod: squawkVars.validityPeriod
        };

        return {
            to: guest.email,
            from: `${this.fromName} <${this.fromEmail}>`,
            subject: `✈️ Your Runway1331 Boarding Pass - Building ${guest.buildingNumber}`,
            templateVars: templateVars,
            text: this.buildPlainTextVersion(templateVars)
        };
    }

    buildPlainTextVersion(vars) {
        return [
            '=== RUNWAY1331 BOARDING PASS ===',
            '',
            `Guest: ${vars.guestName}`,
            `Date: ${vars.checkInDate}`,
            `Building: ${vars.buildingNumber} (Zone ${vars.zone})`,
            '',
            `YOUR SQUAWK CODE: ${vars.squawkCode}`,
            '',
            `Upon arrival, locate Building ${vars.buildingNumber} and enter`,
            `your squawk code at the door keypad. Code activates at`,
            `${vars.checkInTime} on ${vars.checkInDate}.`,
            '',
            `Route map: ${vars.gifUrl}`,
            '',
            'Need assistance? Reply to this email or call +852 XXXX XXXX.'
        ].join('\n');
    }

    async send(emailPayload) {
        console.log('Email ready to send:', {
            to: emailPayload.to,
            subject: emailPayload.subject
        });
        
        return {
            success: true,
            message: 'Email prepared (provider not configured)',
            to: emailPayload.to
        };
    }
}

module.exports = EmailService;
