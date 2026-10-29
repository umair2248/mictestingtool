import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock3, CalendarDays, Mic, ArrowRight } from 'lucide-react';
import { BlogMarkdown } from '../utils/markdown.jsx';
import { getAllBlogPosts, getBlogPost } from '../utils/posts';
import { getArticleOutline } from '../utils/articleOutline';
import '../styles/markdown.css';
import '../styles/pages.css';
import NotFound from './NotFound';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, Math.max(0, (window.scrollY / height) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!post) return <NotFound />;
  const contents = getArticleOutline(post.content).filter(item => item.level === 2);
  const related = getAllBlogPosts().filter(item => item.slug !== slug).slice(0, 3);

  return <div className="page">
    <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <div className="article-wrap">
      <header className="article-hero">
        <nav aria-label="Breadcrumb" className="breadcrumb article-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/blog">Blog</Link><span aria-hidden="true">/</span><span>{post.title}</span></nav>
        <div className="post-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <div className="post-meta">
          <span><CalendarDays size={14} aria-hidden="true" />Published <time dateTime={post.date}>{post.date}</time></span>
          {post.modified && <span>Updated <time dateTime={post.modified}>{post.modified}</time></span>}
          <span><Clock3 size={14} aria-hidden="true" />{post.readTime}</span>
          <span>By <a href="#article-author" rel="author">{post.author}</a></span>
        </div>
      </header>

      <article className="article-body">
        <div className="article-start"><p>Check your input, then listen to a short recording before your next call.</p><Link to="/#microphone-test" className="btn btn-primary"><Mic size={16} aria-hidden="true" />Open the free microphone test</Link></div>
        {contents.length > 0 && <nav className="article-contents" aria-label="On this page"><details><summary>On this page</summary><ol>{contents.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}</ol></details></nav>}
        {post.format === 'html' ? <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.content }} /> : <BlogMarkdown content={post.content} />}
        <div className="cta-band article-cta"><h2>Test your microphone now</h2><p>Record a 10-second clip, play it back and hear exactly how you sound.</p><div className="btn-row"><Link to="/#microphone-test" className="btn btn-primary"><Mic size={16} aria-hidden="true" />Start mic test</Link><Link to="/faq" className="btn btn-ghost">Microphone troubleshooting</Link></div></div>
        {related.length > 0 && <nav className="article-related" aria-label="Related microphone guides"><h2>Related microphone guides</h2><ul>{related.map(item => <li key={item.slug}><Link to={`/blog/${item.slug}`}>{item.title}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}</ul></nav>}
        <aside id="article-author" className="article-author"><h2>About {post.author}</h2><p>Published by the team behind Mic Testing Tool, a browser microphone recorder and playback tool. The guide distinguishes browser input checks from professional audio measurements.</p><p>Found a changed setting or an unclear instruction? <Link to="/contact">Send a correction or question</Link>.</p></aside>
      </article>
    </div>
  </div>;
}
