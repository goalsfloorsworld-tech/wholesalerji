const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace case-sensitive variants
  content = content.replace(/Wholesaleji/g, 'WholesalerJi');
  content = content.replace(/wholesaleji/g, 'wholesalerji');
  content = content.replace(/WholesaleJi/g, 'WholesalerJi');
  content = content.replace(/WHOLESALEJI/g, 'WHOLESALERJI');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      if (/\.(tsx|ts|js|jsx|json)$/.test(file)) {
        replaceInFile(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Done replacing.');
