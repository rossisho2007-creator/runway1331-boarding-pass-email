/**
 * LOGO EMBEDDER
 * Converts logo to base64 for embedding directly in emails
 * Supports: logo.png, logo.jpg, logo.jpeg
 */

const fs = require("fs");
const path = require("path");

class LogoEmbedder {
    
    constructor() {
        this.assetsPath = path.join(__dirname, "..", "email-templates", "assets");
        this.cachedBase64 = null;
        this.logoPath = null;
    }

    findLogo() {
        var extensions = [".png", ".jpg", ".jpeg"];
        for (var i = 0; i < extensions.length; i++) {
            var testPath = path.join(this.assetsPath, "logo" + extensions[i]);
            if (fs.existsSync(testPath)) {
                this.logoPath = testPath;
                return testPath;
            }
        }
        return null;
    }

    getLogoBase64() {
        if (this.cachedBase64) return this.cachedBase64;
        var logoPath = this.findLogo();
        if (!logoPath) {
            console.warn("Logo not found. Place logo.jpg in src/email-templates/assets/");
            return null;
        }
        var imageBuffer = fs.readFileSync(logoPath);
        var base64 = imageBuffer.toString("base64");
        var mimeType = this.getMimeType(logoPath);
        var dataURL = "data:" + mimeType + ";base64," + base64;
        this.cachedBase64 = dataURL;
        console.log("Logo loaded: " + path.basename(logoPath) + " (" + (imageBuffer.length/1024).toFixed(1) + " KB)");
        return dataURL;
    }

    getMimeType(filePath) {
        var ext = path.extname(filePath).toLowerCase();
        var mimeTypes = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml" };
        return mimeTypes[ext] || "image/png";
    }

    clearCache() { this.cachedBase64 = null; }
}

module.exports = LogoEmbedder;