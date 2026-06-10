const EmailService = require('../src/email-service/sendEmail');
const GifGenerator = require('../src/gif-generator/generatePathGif');

const emailService = new EmailService();
const gifGen = new GifGenerator();

const testGuests = [
    { email: 'guest1@test.com', name: 'Emily Chen', buildingNumber: 71, checkInDate: '15 Dec 2024', pin: '4207' },
    { email: 'guest2@test.com', name: 'James Wong', buildingNumber: 84, checkInDate: '16 Dec 2024', pin: '3815' },
    { email: 'guest3@test.com', name: 'Sarah Li',    buildingNumber: 98, checkInDate: '17 Dec 2024', pin: '5021' },
];

console.log('=== RUNWAY1331 BOARDING PASS TEST ===\n');

testGuests.forEach(guest => {
    const gif = gifGen.getGifForBuilding(guest.buildingNumber);
    const email = emailService.buildBoardingPassEmail({
        ...guest,
        gifUrl: 'https://runway1331.com/gifs/' + gif.filename,
        zone: gif.zone
    });
    
    console.log('TO: ' + email.to);
    console.log('SUBJECT: ' + email.subject);
    console.log('BUILDING: ' + guest.buildingNumber + ' -> Zone ' + gif.zone + ' -> ' + gif.filename);
    console.log('SQUAWK CODE: ' + email.templateVars.squawkCode);
    console.log('---');
});

console.log('Test complete!');
