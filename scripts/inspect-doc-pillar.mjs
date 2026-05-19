import fs from 'node:fs';

const src = '/home/bafu/.claude/projects/-home-workspaces-conversations-dde81e9e-f3b7-488e-9b43-6d1beaef34ef/f5021c6f-f592-41a3-bcca-1b0650d32d5b/tool-results/mcp-gws-docs_get_as_text-1779154035344.txt';
const raw = fs.readFileSync(src, 'utf-8');
const arr = JSON.parse(raw);
for (const chunk of arr) {
  const t = chunk.text || '';
  if (t.includes('"text":')) {
    const start = t.indexOf('{');
    let payload = t.slice(start);
    if (payload.endsWith('```')) payload = payload.slice(0, -3);
    const obj = JSON.parse(payload);
    const docText = obj.text || '';
    const idx = docText.indexOf('Pillar');
    console.log('Pillar marker at:', idx);
    if (idx >= 0) {
      console.log('---- 2500 chars from Pillar marker ----');
      console.log(docText.slice(idx, idx + 2500));
    }
    break;
  }
}
