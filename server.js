const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ensure data directory and submissions file exist
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
    }
}

ensureDataDir();

// Contact form API – save submission and optionally send email
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and message are required.'
        });
    }

    const submission = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        const submissions = JSON.parse(data);
        submissions.push(submission);
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
    } catch (err) {
        console.error('Error saving submission:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to save your message. Please try again.'
        });
    }

    res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been received.'
    });
});

// Optional: get all submissions (for your own use, protect in production)
app.get('/api/submissions', (req, res) => {
    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        const submissions = JSON.parse(data);
        res.json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Could not load submissions.' });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
});
