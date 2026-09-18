const fs = require('fs');
const path = require('path');

// Single source of truth for folder names
const folders = {
    'Me': 'me',
    'Family': 'Family',
    'Bija': 'Bija',
    'Funny': 'Funny_Pictures',
    'Trips': 'Trips'
};

const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
let photos = [];
let id = 1;

Object.entries(folders).forEach(([category, folderName]) => {
    const dirPath = path.join(__dirname, folderName);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            // Ignore hidden files and trashed files
            if (validExts.includes(ext) && !file.startsWith('.') && !file.includes('.trashed')) {
                photos.push({
                    id: id++,
                    title: path.basename(file, path.extname(file)).replace(/[-_]/g, ' '),
                    category: category,
                    img: `./${folderName}/${file}`
                });
            }
        });
    }
});

fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
console.log(`✅ Indexed ${photos.length} photos without duplicates!`);
