/**
 * Runway1331 Boarding Pass System
 * Main entry point - generates and sends boarding pass emails
 */

const EmailService = require('./email-service/sendEmail');
const GifGenerator = require('./gif-generator/generatePathGif');
const SquawkCodeFormatter = require('./pin-service/squawkCodeFormatter');
const TemplateEngine = require('./email-service/templateEngine');

class BoardingPassSystem {
    
    constructor(config = {}) {
        this.emailService = new EmailService(config);
        this.gifGenerator = new GifGenerator();
        this.templateEngine = new TemplateEngine();
        this.gifBaseUrl = config.gifBaseUrl || 'https://runway1331.com/gifs';
    }

    /**
     * Process a single guest: generate PIN, map building to zone, build email
     * @param {object} guest - Guest data
     * @param {string} guest.email
     * @param {string} guest.name
     * @param {number} guest.buildingNumber
     * @param {string} guest.checkInDate
     * @returns {object} Complete email ready to send
     */
    processGuest(guest) {
        
        // Generate PIN if not provided
        const pin = guest.pin || SquawkCodeFormatter.generatePin();
        
        // Map building to zone GIF
        const gif = this.gifGenerator.getGifForBuilding(guest.buildingNumber);
        
        // Build email payload
        const email = this.emailService.buildBoardingPassEmail({
            email: guest.email,
            name: guest.name,
            buildingNumber: guest.buildingNumber,
            checkInDate: guest.checkInDate,
            pin: pin,
            gifUrl: `${this.gifBaseUrl}/${gif.filename}`,
            zone: gif.zone
        });
        
        // Render HTML template
        email.html = this.templateEngine.render('boarding-pass', email.templateVars);
        
        return email;
    }

    /**
     * Process multiple guests in batch
     * @param {array} guests - Array of guest objects
     * @returns {array} Array of email payloads
     */
    processBatch(guests) {
        return guests.map(guest => this.processGuest(guest));
    }

    /**
     * Process and send to a single guest
     * @param {object} guest - Guest data
     * @returns {object} Send result
     */
    async processAndSend(guest) {
        const email = this.processGuest(guest);
        return this.emailService.send(email);
    }
}

module.exports = BoardingPassSystem;
