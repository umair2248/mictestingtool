import { useLocation } from 'react-router-dom';
import { pages, siteName, siteUrl } from '../data/site';
import { getBlogPost } from '../utils/posts';
import { useEffect } from 'react';
import { getLocale, languageVersions } from '../data/locales';

export function getSEO(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const post = path.startsWith('/blog/') ? getBlogPost(path.slice(6)) : null;
  const locale = getLocale(path);
  const page = locale || (post ? { title: post.seoTitle || `${post.title} | ${siteName}`, description: post.excerpt, post } : pages[path]);
  return { ...(page || { title: `Page Not Found | ${siteName}`, description: 'This page could not be found.', noindex: true }), locale, language: locale?.code || 'en', isTool: path === '/' || !!locale, isSpeaker: path === '/speaker-test', isWebcam: path === '/webcam-test', path, canonical: `${siteUrl}${path === '/' ? '/' : path}` };
}

export function getSchemas(seo) {
  const schemas = [];
  if (seo.path === '/') {
    schemas.push({ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: siteName, url: `${siteUrl}/`, logo: `${siteUrl}/mic-favicon.svg`, email: 'support@mictestingtool.com' });
    schemas.push({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: siteName, inLanguage: 'en', publisher: { '@id': `${siteUrl}/#organization` } });
  }
  if (seo.isTool) schemas.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: seo.locale?.h1 || 'Online Microphone Tester', url: seo.canonical, inLanguage: seo.language, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web browser', description: seo.description, isAccessibleForFree: true });
  if (seo.isSpeaker) schemas.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Free Online Speaker & Headphone Test', url: seo.canonical, inLanguage: 'en', applicationCategory: 'MultimediaApplication', operatingSystem: 'Web browser', description: seo.description, isAccessibleForFree: true });
  if (seo.isWebcam) schemas.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Webcam and Microphone Test', url: seo.canonical, inLanguage: 'en', applicationCategory: 'MultimediaApplication', operatingSystem: 'Web browser', description: seo.description, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, featureList: ['Live webcam preview', 'Camera resolution and frame rate', 'Microphone input level', 'Video and audio test recording', 'Webcam snapshot'] });
  if (seo.post) {
    const p = seo.post;
    schemas.push({ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${seo.canonical}#article`, url: seo.canonical, headline: p.title, description: p.excerpt, inLanguage: 'en', mainEntityOfPage: { '@type': 'WebPage', '@id': seo.canonical }, ...(p.date ? { datePublished: p.date } : {}), ...(p.modified ? { dateModified: p.modified } : {}), ...(p.image ? { image: `${siteUrl}${p.image}` } : {}), author: { '@type': 'Organization', name: p.author || siteName, url: `${seo.canonical}#article-author` }, publisher: { '@type': 'Organization', name: siteName, url: `${siteUrl}/` }, isAccessibleForFree: true });
  }
  if (seo.path !== '/' && !seo.noindex && !seo.locale) {
    const items = [{ name: 'Home', item: `${siteUrl}/` }];
    if (seo.post) items.push({ name: 'Blog', item: `${siteUrl}/blog` });
    items.push({ name: seo.post?.title || seo.title.split(' | ')[0], item: seo.canonical });
    schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })) });
  }
  return schemas;
}

export default function SEO() {
  const { pathname } = useLocation();
  const seo = getSEO(pathname);
  const image = seo.post?.image ? `${siteUrl}${seo.post.image}` : `${siteUrl}/social-card.png`;
  const imageAlt = seo.post?.imageAlt || seo.locale?.h1 || 'Mic Testing Tool — record, listen, and check your microphone input';
  useEffect(() => { document.documentElement.lang = seo.language; document.documentElement.dir = 'ltr'; }, [seo.language]);
  return <>
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <meta name="robots" content={seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
    <link rel="canonical" href={seo.canonical} />
    {seo.isTool && languageVersions.map(item => <link key={item.code} rel="alternate" hrefLang={item.code} href={`${siteUrl}${item.path}`} />)}
    {seo.isTool && <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/`} />}
    <meta property="og:locale" content={seo.locale?.og || 'en_US'} />
    {seo.isTool && languageVersions.filter(item => item.code !== seo.language).map(item => <meta key={item.code} property="og:locale:alternate" content={item.og || 'en_US'} />)}
    <meta property="og:type" content={seo.post ? 'article' : 'website'} />
    {seo.post?.date && <meta property="article:published_time" content={seo.post.date} />}
    {seo.post?.modified && <meta property="article:modified_time" content={seo.post.modified} />}
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:url" content={seo.canonical} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={imageAlt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
    <meta name="twitter:image" content={image} />
    <script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchemas(seo)).replace(/</g, '\\u003c') }} />
  </>;
}
