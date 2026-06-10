/**
 * Email Service
 * Handles sending boarding pass emails to guests
 * Provider-agnostic — swap SendGrid/Mailgun/SES by changing config
 */

const SquawkCodeFormatter = require('../pin-service/squawkCodeFormatter');

class EmailService {
    
    constructor(config = {}) {
        this.provider = config.provider || 'sendgrid';
        this.fromEmail = config.fromEmail || 'checkin@runway1331.com';
        this.fromName = config.fromName || 'Runway1331';
        this.checkInTime = config.checkInTime || '15:00';
    }

    /**
     * Builds the complete boarding pass email payload
     * @param {object} guest - Guest information
     * @param {string} guest.email - Guest email address
     * @param {string} guest.name - Guest full name
     * @param {string} guest.buildingBlock - Building identifier (e.g., "A", "Block B")
     * @param {string} guest.checkInDate - Check-in date
     * @param {string} guest.pin - Door access PIN
     * @param {string} guest.gifUrl - URL to personalized animated map GIF
     * @returns {object} Email payload ready for sending
     */
    buildBoardingPassEmail(guest) {
        
        const squawkVars = SquawkCodeFormatter.getEmailVariables(guest.pin);
        
        // Template variables to inject into HTML
        const templateVars = {
            guestName: guest.name,
            checkInDate: guest.checkInDate,
            checkInTime: this.checkInTime,
            buildingBlock: guest.buildingBlock,
            squawkCode: squawkVars.squawkCode,
            gifUrl: guest.gifUrl,
            validityPeriod: squawkVars.validityPeriod
        };

        return {
            to: guest.email,
            from: `${this.fromName} <${this.fromEmail}>`,
            subject: `✈️ Your Runway1331 Boarding Pass - Gate ${guest.buildingBlock}`,
            templateVars: templateVars,
            // Plain text fallback
            text: this.buildPlainTextVersion(templateVars)
        };
    }

    /**
     * Builds plain text fallback for email clients that don't render HTML
     * @param {object} vars - Template variables
     * @returns {string} Plain text email
     */
    buildPlainTextVersion(vars) {
        return `
=== RUNWAY1331 BOARDING PASS ===

Guest: ${vars.guestName}
Date: ${vars.checkInDate}
Gate: ${vars.buildingBlock}

YOUR SQUAWK CODE: ${vars.squawkCode}

Upon arrival, locate Building ${vars.buildingBlock} and enter 
your squawk code at the door keypad. Code activates at 
${vars.checkInTime} on ${vars.checkInDate}.

Route map: ${vars.gifUrl}

Need assistance? Reply to this email or call +852 XXXX XXXX.
        `.trim();
    }

    /**
     * Placeholder for actual email sending
     * Replace with SendGrid/Mailgun/SES API call
     * @param {object} emailPayload - From buildBoardingPassEmail()
     * @returns {Promise<object>} Send result
     */
    async send(emailPayload) {
        // TODO: Integrate with email provider API
        // Example with SendGrid:
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // return sgMail.send(emailPayload);
        
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