const fs = require('fs');
const path = require('path');

// Scan both lowercase and capitalized folder names to prevent path mismatches
const targetCategories = [
    { category: 'Me', folderNames: ['me', 'Me'] },
    { category: 'Family', folderNames: ['Family', 'family'] },
    { category: 'Bija', folderNames: ['Bija', 'bija'] },
    { category: 'Funny', folderNames: ['Funny_Pictures', 'funny_pictures', 'Funny', 'funny'] },
    { category: 'Trips', folderNames: ['Trips', 'trips'] }
];

const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
let photos = [];
let id = 1;

targetCategories.forEach(({ category, folderNames }) => {
    folderNames.forEach(folderName => {
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
console.log(`✅ Indexed ${photos.length} photos!`);
