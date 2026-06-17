/**
 * GIF EMBEDDER
 * Converts GIF files to base64 for embedding directly in emails
 */

const fs = require('fs');
const path = require('path');

class GifEmbedder {
    
    constructor() {
        this.gifsPath = path.join(__dirname, '..', 'email-templates', 'assets', 'gifs');
        this.cache = {};
    }

    getGifBase64(buildingNumber) {
        
        var cacheKey = 'building-' + buildingNumber;
        
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }
        
        var filename = 'building-' + buildingNumber + '.gif';
        var filePath = path.join(this.gifsPath, filename);
        
        if (!fs.existsSync(filePath)) {
            console.warn('GIF not found: ' + filePath);
            return null;
        }
        
        var buffer = fs.readFileSync(filePath);
        var base64 = buffer.toString('base64');
        var dataURL = 'data:image/gif;base64,' + base64;
        
        this.cache[cacheKey] = dataURL;
        
        console.log('GIF loaded: ' + filename + ' (' + (buffer.length / 1024).toFixed(1) + ' KB)');
        
        return dataURL;
    }
}

module.exports = GifEmbedder;
