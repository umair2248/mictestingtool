import { Link } from 'react-router-dom';
export default function NotFound() {
  return <section className="page-hero not-found"><div className="container">
    <span className="eyebrow">Error 404</span>
    <h1>Page not found</h1>
    <p className="lead">The page or article you requested does not exist.</p>
    <div className="btn-row page-links" style={{ justifyContent: 'center' }}><Link to="/" className="btn btn-primary">Test your microphone</Link><Link to="/blog" className="btn btn-ghost">Browse the guides</Link></div>
  </div></section>;
}
