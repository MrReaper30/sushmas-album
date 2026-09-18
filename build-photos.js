const fs = require('fs');
const path = require('path');

const categoryFolders = [
    { category: 'Me', possibleFolders: ['Me', 'me'] },
    { category: 'Family', possibleFolders: ['Family', 'family'] },
    { category: 'Bija', possibleFolders: ['Bija', 'bija'] },
    { category: 'Funny', possibleFolders: ['Funny_Pictures', 'funny_pictures', 'Funny', 'funny'] },
    { category: 'Trips', possibleFolders: ['Trips', 'trips'] }
];

const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
let photos = [];
let id = 1;
let seenFiles = new Set();

categoryFolders.forEach(({ category, possibleFolders }) => {
    possibleFolders.forEach(folderName => {
        const dirPath = path.join(__dirname, folderName);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
                const uniqueKey = `${category}-${file.toLowerCase()}`;
                
                if (validExts.includes(ext) && !file.startsWith('.') && !file.includes('.trashed') && !seenFiles.has(uniqueKey)) {
                    seenFiles.add(uniqueKey);
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
console.log(`✅ Indexed ${photos.length} photos cleanly without missing files or duplicates!`);
