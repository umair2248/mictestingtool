

const postModules = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' });

export const parseFrontmatter = (rawContent) => {
  const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.replace(/^\uFEFF/, '').match(regex);

  if (!match) return { metadata: {}, content: rawContent };

  const yamlBlock = match[1];
  const content = match[2];
  const metadata = {};

  yamlBlock.split('\n').forEach((line) => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');

      if (key === 'tags') {
        metadata[key] = value.replace(/^\[|\]$/g, '').split(',').map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''));
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content };
};

export function getAllBlogPosts() {
  const localPosts = Object.entries(postModules)
    .map(([path, source]) => {
      const { metadata, content } = parseFrontmatter(source);
      const slug = path.split('/').pop().replace(/\.md$/, '');

      return {
        slug,
        title: metadata.title ?? 'Untitled Post',
        seoTitle: metadata.seoTitle ?? '',
        excerpt: metadata.excerpt ?? '',
        date: metadata.date ?? '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        readTime: metadata.readTime ?? `${Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 225))} min read`,
        author: metadata.author ?? 'Mic Testing Tool',
        modified: metadata.modified ?? '',
        content,
      };
    })
    ;
  return localPosts.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
}

export function getBlogPost(slug) {
  return getAllBlogPosts().find((post) => post.slug === slug) ?? null;
}

