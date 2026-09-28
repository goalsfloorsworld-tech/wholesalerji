const http = require('http');

function fetchPage(port) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:' + port + '/blog/transform-your-interiors-with-premium-primo-panels-in-gurgaon', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    let html = await fetchPage(3001).catch(() => fetchPage(3000));
    
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="(.*?)"[^>]*>/i);
    const canonMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="(.*?)"[^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="(.*?)"[^>]*>/i);
    const ldJsonMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/is);

    console.log('--- SEO AUDIT RESULTS ---');
    console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('Description:', descMatch ? descMatch[1].substring(0, 50) + '...' : 'NOT FOUND');
    console.log('Canonical:', canonMatch ? canonMatch[1] : 'NOT FOUND');
    console.log('OG Image:', ogImageMatch ? ogImageMatch[1] : 'NOT FOUND');
    console.log('JSON-LD Exists:', ldJsonMatch ? 'YES' : 'NO');
    if(ldJsonMatch) console.log('JSON-LD Preview:', ldJsonMatch[1].substring(0, 150) + '...');

  } catch(e) {
    console.error('Failed to fetch page', e);
  }
})();
