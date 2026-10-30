import ReactMarkdown from 'react-markdown';
import { getArticleOutline } from './articleOutline';
export function BlogMarkdown({ content, className = '' }) {
  const headings = getArticleOutline(content);
  const headingId = node => headings.find(item => item.line === node?.position?.start.line)?.id;
  return (
    <div className={`markdown-body ${className}`.trim()}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h2 id={headingId(node)} className="markdown-h2" {...props} />,
          h2: ({ node, ...props }) => <h2 id={headingId(node)} className="markdown-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 id={headingId(node)} className="markdown-h3" {...props} />,
          // A paragraph holding only an image becomes a <figure>, which may not sit inside <p>.
          p: ({ node, ...props }) => node?.children?.length === 1 && node.children[0].tagName === 'img' ? props.children : <p className="markdown-p" {...props} />,
          // Article illustrations are drawn at 1200x675 so the space is reserved before they load.
          img: ({ node: _node, title, alt, ...props }) => <figure className="markdown-figure"><img alt={alt} width="1200" height="675" loading="lazy" decoding="async" {...props} />{title && <figcaption>{title}</figcaption>}</figure>,
          ul: ({ node: _node, ...props }) => <ul className="markdown-list" {...props} />,
          ol: ({ node: _node, ...props }) => <ol className="markdown-list" {...props} />,
          li: ({ node: _node, ...props }) => <li className="markdown-list-item" {...props} />,
          blockquote: ({ node: _node, ...props }) => <blockquote className="markdown-quote" {...props} />,
          a: ({ node: _node, ...props }) => <a className="markdown-link" {...props} />,
          pre: ({ node: _node, ...props }) => <pre className="markdown-code-block" {...props} />,
          code: ({ node: _node, className, ...props }) => <code className={className || 'markdown-inline-code'} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
