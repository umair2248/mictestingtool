// Stable fragment targets shared by the rendered headings and contents links.
export function getArticleOutline(markdown) {
  const seen = new Map();
  let fence = '';
  return markdown.split(/\r?\n/).flatMap((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) { if (!fence) fence = marker[1][0]; else if (fence === marker[1][0]) fence = ''; return []; }
    if (fence) return [];
    const match = line.match(/^(#{1,3})\s+(.+?)\s*#*$/);
    if (!match) return [];
    const title = match[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '');
    const base = title.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/[\s-]+/g, '-') || 'section';
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return [{ title, level: match[1].length, id: count ? `${base}-${count + 1}` : base, line: index + 1 }];
  });
}
