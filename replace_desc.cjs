const fs = require('fs');
let data = fs.readFileSync('src/data/exhibits.ts', 'utf8');
data = data.replace(/ *description:.*(\n)?/g, '');
data = data.replace(/ *detailedDescription:.*(\n)?/g, '');
fs.writeFileSync('src/data/exhibits.ts', data);
