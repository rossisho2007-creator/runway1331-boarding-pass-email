/**
 * Runway1331 Boarding Pass System
 * Main entry point
 */

const EmailService = require('./email-service/sendEmail');
const GifGenerator = require('./gif-generator/generatePathGif');
const SquawkCodeFormatter = require('./pin-service/squawkCodeFormatter');
const TemplateEngine = require('./email-service/templateEngine');

class BoardingPassSystem {
    
    constructor(config = {}) {
        this.emailService = new EmailService({
            logoUrl: config.logoUrl || 'https://runway1331.com/logo.png'
        });
        this.gifGenerator = new GifGenerator();
        this.templateEngine = new TemplateEngine();
        this.gifBaseUrl = config.gifBaseUrl || 'https://runway1331.com/gifs';
    }

    processGuest(guest) {
        
        const pin = guest.pin || SquawkCodeFormatter.generatePin();
        const gif = this.gifGenerator.getGifForBuilding(guest.buildingNumber);
        
        const email = this.emailService.buildBoardingPassEmail({
            email: guest.email,
            name: guest.name,
            buildingNumber: guest.buildingNumber,
            checkInDate: guest.checkInDate,
            pin: pin,
            gifUrl: `${this.gifBaseUrl}/${gif.filename}`,
            zone: gif.zone
        });
        
        email.html = this.templateEngine.render('boarding-pass', email.templateVars);
        
        return email;
    }

    processBatch(guests) {
        return guests.map(guest => this.processGuest(guest));
    }

    async processAndSend(guest) {
        const email = this.processGuest(guest);
        return this.emailService.send(email);
    }
}

module.exports = BoardingPassSystem;
