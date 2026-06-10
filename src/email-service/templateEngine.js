/**
 * Template Engine
 * Replaces {{variables}} in HTML templates with actual data
 */

const fs = require('fs');
const path = require('path');

class TemplateEngine {
    
    constructor() {
        this.templatesPath = path.join(__dirname, '..', 'email-templates');
        this.cache = {};
    }

    /**
     * Load and render a template
     * @param {string} templateName - Name without .html
     * @param {object} variables - Key-value pairs to inject
     * @returns {string} Rendered HTML
     */
    render(templateName, variables = {}) {
        
        const html = this.loadTemplate(templateName);
        
        let rendered = html;
        
        // Replace all {{variable}} placeholders
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            rendered = rendered.replace(regex, value || '');
        }
        
        return rendered;
    }

    /**
     * Load template file
     * @param {string} templateName - Template name
     * @returns {string} Raw HTML
     */
    loadTemplate(templateName) {
        
        // Return cached if available
        if (this.cache[templateName]) {
            return this.cache[templateName];
        }
        
        const filePath = path.join(this.templatesPath, `${templateName}.html`);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Template not found: ${templateName}.html`);
        }
        
        const html = fs.readFileSync(filePath, 'utf-8');
        
        // Cache for performance
        this.cache[templateName] = html;
        
        return html;
    }

    /**
     * Clear template cache (useful during development)
     */
    clearCache() {
        this.cache = {};
    }
}

module.exports = TemplateEngine;
