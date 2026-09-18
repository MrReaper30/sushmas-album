const fs = require('fs');
const path = require('path');

const categoryMap = [
    { category: 'Me', folders: ['me', 'Me'] },
    { category: 'Family', folders: ['Family', 'family'] },
    { category: 'Bija', folders: ['Bija', 'bija'] },
    { category: 'Funny', folders: ['Funny_Pictures', 'funny_pictures', 'Funny', 'funny'] },
    { category: 'Trips', folders: ['Trips', 'trips'] }
];

const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
let photos = [];
let id = 1;

categoryMap.forEach(({ category, folders }) => {
    folders.forEach(folderName => {
        const dirPath = path.join(__dirname, folderName);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
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
});

fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
console.log(`✅ Indexed ${photos.length} photos cleanly!`);
