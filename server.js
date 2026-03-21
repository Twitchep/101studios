const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Path to content.json
const CONTENT_FILE = path.join(__dirname, 'public', 'content.json');

// Ensure content.json exists
if (!fs.existsSync(CONTENT_FILE)) {
    const defaultContent = {
        portfolio: [],
        products: [],
        updates: [],
        videos: [],
        announcements: []
    };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
}

// API Routes
app.get('/api/content', (req, res) => {
    try {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        res.json(content);
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(500).json({ error: 'Failed to read content' });
    }
});

app.post('/api/content', (req, res) => {
    try {
        const newContent = req.body;

        // Validate JSON structure
        if (!newContent || typeof newContent !== 'object') {
            return res.status(400).json({ error: 'Invalid content format' });
        }

        // Ensure required arrays exist
        const requiredArrays = ['portfolio', 'products', 'updates', 'videos', 'announcements'];
        requiredArrays.forEach(key => {
            if (!Array.isArray(newContent[key])) {
                newContent[key] = [];
            }
        });

        // Write to file
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2));

        console.log(`✅ Content updated at ${new Date().toISOString()}`);
        res.json({
            success: true,
            message: 'Content updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ error: 'Failed to save content' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Content API server running on port ${PORT}`);
    console.log(`📁 Content file: ${CONTENT_FILE}`);
});

module.exports = app;