const fs = require('fs');
const path = require('path');

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
            if (validExts.includes(ext)) {
                photos.push({
                    id: id++,
                    title: path.basename(file, ext).replace(/[-_]/g, ' '),
                    category: category,
                    img: `./${folderName}/${file}`
                });
            }
        });
    }
});

fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
console.log(`✅ Loaded ${photos.length} local images into photos.json!`);
