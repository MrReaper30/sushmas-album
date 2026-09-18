const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Database simulation (JSON file)
const dbFile = path.join(__dirname, 'data.json');
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify([
        { id: 1, title: 'Beach Outing', category: 'Trips', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' },
        { id: 2, title: 'Family Gathering', category: 'Events', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800' }
    ]));
}

// APIs
app.get('/api/photos', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbFile));
    res.json(data);
});

app.post('/api/upload', upload.single('photo'), (req, res) => {
    const { title, category } = req.body;
    if (!req.file) return res.status(400).send('No image uploaded.');

    const data = JSON.parse(fs.readFileSync(dbFile));
    const newPhoto = {
        id: Date.now(),
        title: title || 'Untitled',
        category: category || 'General',
        url: `/uploads/${req.file.filename}`
    };
    data.unshift(newPhoto);
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

    res.json(newPhoto);
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Sushma's Album running at: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});
