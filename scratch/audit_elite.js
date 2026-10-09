const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/templates/EliteSeriesTemplate.tsx');
const dataFilePath = path.join(__dirname, '../src/data/elitePanelsData.ts');

const content = fs.readFileSync(filePath, 'utf8');
const dataContent = fs.readFileSync(dataFilePath, 'utf8');

// Helper to strip HTML tags for text content
function stripTags(html) {
    return html.replace(/<[^>]*>?/gm, '').trim();
}

console.log("=== HEADINGS ===");
const headingsIter = content.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/g);
for (const match of headingsIter) {
    console.log(`[${match[1]}] ${stripTags(match[2]).replace(/\s+/g, ' ')}`);
}

console.log("\n=== KEYWORD CHECK ===");
const keywords = ["wholesale", "manufacturer", "Gurgaon", "Gurugram", "Delhi NCR", "India", "wall panels", "marble panels", "bulk", "dealer", "distributor", "contractor", "architect", "price", "rate", "MOQ", "minimum order"];
keywords.forEach(kw => {
    const regex = new RegExp(`([^\\.\\n]*\\b${kw}\\b[^\\.\\n]*\\.)`, 'gi');
    const matches = [...content.matchAll(regex)];
    if (matches.length > 0) {
        console.log(`\nKeyword: "${kw}" found in:`);
        matches.slice(0, 5).forEach(m => console.log(`- ${stripTags(m[1]).replace(/\s+/g, ' ').trim()}`));
        if (matches.length > 5) console.log(`  (+ ${matches.length - 5} more)`);
    } else {
        console.log(`\nKeyword: "${kw}" - NOT FOUND`);
    }
});

console.log("\n=== CONDITIONAL RENDERING / UNMOUNTING CHECK ===");
const condIter = content.matchAll(/\{([^\}]*&&\s*<[^>]+>)/g);
let foundCond = false;
for (const match of condIter) {
    console.log(`Found conditional render: { ${match[1].substring(0, 100)}... }`);
    foundCond = true;
}
if (!foundCond) console.log("None found via && < tag.");

const activeIter = content.matchAll(/active[A-Za-z0-Index]* ===/g);
let foundActive = false;
for (const match of activeIter) {
    console.log(`Found active state pattern: ${match[0]}`);
    foundActive = true;
}
if (!foundActive) console.log("No active state patterns found.");

console.log("\n=== IMAGES ===");
const imgIter = content.matchAll(/<Image[^>]*alt=(['"])(.*?)\1|alt=\{([^}]+)\}/g);
for (const match of imgIter) {
    console.log(`Alt: ${match[2] || match[3]}`);
}

console.log("\n=== LINKS ===");
const linkIter = content.matchAll(/<Link[^>]*href=(['"])(.*?)\1[^>]*>([\s\S]*?)<\/Link>/g);
for (const match of linkIter) {
    console.log(`Link to ${match[2]}: ${stripTags(match[3]).replace(/\s+/g, ' ')}`);
}
