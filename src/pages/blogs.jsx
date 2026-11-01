import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogPosts } from '../utils/posts';
import { Search, Calendar, Clock, ArrowRight, Mic } from 'lucide-react';
import '../styles/pages.css';

export default function StaticBlogArchive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const posts = getAllBlogPosts();
  const allTags = ['All', ...new Set(posts.flatMap(post => post.tags))];
  const query = searchQuery.toLowerCase();
  const filteredPosts = posts.filter(post => (selectedTag === 'All' || post.tags.includes(selectedTag)) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query));
  const showFeatured = searchQuery === '' && selectedTag === 'All';
  const featuredPost = posts.find(post => post.slug === 'how-to-test-your-microphone') || posts[0];
  const gridPosts = filteredPosts.filter(post => !(showFeatured && post.slug === featuredPost?.slug));

  return <div className="page">
    <header className="page-hero">
      <div className="container">
        <span className="eyebrow">Microphone help</span>
        <h1>Microphone Testing Guides</h1>
        <p className="lead">Step-by-step guides for testing a microphone, setting it up on Windows or Mac, and fixing low volume, noise, echo and permission problems.</p>
      </div>
    </header>

    <section className="section section--tight-top">
      <div className="container">
        <div className="blog-toolbar">
          <div className="search-box"><Search size={16} aria-hidden="true" /><input type="search" className="input" aria-label="Search microphone guides" placeholder="Search microphone guides…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} /></div>
          <div className="tag-list">{allTags.map(tag => <button key={tag} type="button" onClick={() => setSelectedTag(tag)} aria-pressed={selectedTag === tag} className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}>{tag}</button>)}</div>
        </div>

        {showFeatured && featuredPost && <article className="featured-post">
          <div>
            <div className="post-tags">{featuredPost.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <h2><Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
            <p>{featuredPost.excerpt}</p>
            <div className="post-meta"><span><Calendar size={14} aria-hidden="true" />{featuredPost.date}</span><span><Clock size={14} aria-hidden="true" />{featuredPost.readTime}</span></div>
            <Link to={`/blog/${featuredPost.slug}`} className="btn btn-primary" style={{ marginTop: 22 }}>Read the guide<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          {featuredPost.image ? <Link to={`/blog/${featuredPost.slug}`} className="featured-post__image" tabIndex={-1}><img src={featuredPost.image} alt={featuredPost.imageAlt || featuredPost.title} width="1200" height="630" fetchPriority="high" /></Link> : <div className="featured-post__art" aria-hidden="true"><span><Mic size={38} /></span></div>}
        </article>}

        {filteredPosts.length === 0 ? <p className="empty-state">No guides match your search. Try another keyword.</p>
          : gridPosts.length > 0 && <div className="grid grid-3">{gridPosts.map(post => <article key={post.slug} className="card post-card">
            <div>
              {post.image && <Link to={`/blog/${post.slug}`} className="post-card__image" tabIndex={-1}><img src={post.image} alt={post.imageAlt || post.title} width="1200" height="630" loading="lazy" decoding="async" /></Link>}
              <div className="post-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
            </div>
            <div className="post-card__foot"><span className="post-meta"><span><Clock size={13} aria-hidden="true" />{post.readTime}</span></span><Link to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>Read guide <ArrowRight size={14} aria-hidden="true" /></Link></div>
          </article>)}</div>}
      </div>
    </section>
  </div>;
}
