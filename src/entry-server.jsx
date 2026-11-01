import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { PassThrough } from 'node:stream';
import { AppRoutes } from './AppRouter';
import { getAllBlogPosts } from './utils/posts';
import { pages } from './data/site';
import { locales } from './data/locales';

export const routes = () => [...Object.keys(pages), ...locales.map(locale => locale.path), ...getAllBlogPosts().map(post => `/blog/${post.slug}`)];
export const sitemapRoutes = () => [...locales.map(locale => ({ path: locale.path })), ...Object.entries(pages).filter(([, page]) => !page.noindex).map(([path, page]) => ({ path, image: page.image })), ...getAllBlogPosts().map(post => ({ path: `/blog/${post.slug}`, modified: post.modified || post.date, image: post.image }))];

export function render(url) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    let failure;
    output.on('data', chunk => { html += chunk.toString(); });
    output.on('end', () => failure ? reject(failure) : resolve(html));
    output.on('error', reject);
    const stream = renderToPipeableStream(<StaticRouter location={url}><AppRoutes /></StaticRouter>, {
      onAllReady() { stream.pipe(output); },
      onShellError: reject,
      onError(error) { failure = error; },
    });
  });
}
