/**
 * Squawk Code Formatter
 * Formats PIN codes in aviation squawk code style
 * Aviation squawk codes are 4-digit numbers displayed with spacing
 */

class SquawkCodeFormatter {
    
    /**
     * Formats a raw PIN into squawk code display format
     * @param {string|number} pin - The raw PIN code
     * @returns {string} Formatted squawk code (e.g., "4 2 0 7")
     * @example
     *   formatPin(4207) → "4 2 0 7"
     *   formatPin("042") → "0 4 2 0"
     */
    static formatPin(pin) {
        // Ensure 4 digits with leading zeros
        const pinString = pin.toString().padStart(4, '0');
        // Add spaces between each digit
        return pinString.split('').join(' ');
    }

    /**
     * Generates a random 4-digit PIN
     * @returns {string} 4-digit PIN as string
     */
    static generatePin() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    /**
     * Validates a PIN format
     * @param {string} pin - PIN to validate
     * @returns {boolean} True if valid 4-digit format
     */
    static validatePin(pin) {
        return /^\d{4}$/.test(pin.toString().padStart(4, '0'));
    }

    /**
     * Returns complete template variables for email
     * @param {string} pin - Raw PIN
     * @param {string} validityPeriod - e.g., "your entire stay"
     * @returns {object} Template variables
     */
    static getEmailVariables(pin, validityPeriod = 'your entire stay') {
        return {
            squawkCode: this.formatPin(pin),
            rawPin: pin,
            validityPeriod: validityPeriod
        };
    }
}

module.exports = SquawkCodeFormatter;