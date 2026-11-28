import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// React Router runs navigations inside startTransition, so while a lazy page chunk loads
// the old page stays on screen with no feedback. This bar starts the moment a navigation
// begins (internal link click or back/forward) and finishes when the new route commits.

const listeners = new Set();
let state = 'idle';
let committedPath = null; // pathname + search of the page currently on screen
const currentPath = () => window.location.pathname + window.location.search;
const setState = next => { state = next; listeners.forEach(fn => fn(next)); };

function isInternalNavigation(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page (or only the #hash changes): nothing to load.
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

export function NavigationProgress() {
  const [phase, setPhase] = useState(state);
  const doneTimer = useRef();

  useEffect(() => {
    listeners.add(setPhase);
    const start = () => { clearTimeout(doneTimer.current); setState('loading'); };
    const onClick = event => { if (isInternalNavigation(event)) start(); };
    // Back/forward: React may commit a cached page synchronously inside the router's own
    // popstate handler, before this one runs. Only start if the new page isn't on screen yet.
    const onPopState = () => { if (currentPath() !== committedPath) start(); };
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState, true);
    return () => {
      listeners.delete(setPhase);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState, true);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-navigating', phase === 'loading');
    clearTimeout(doneTimer.current);
    if (phase === 'done') doneTimer.current = setTimeout(() => setState('idle'), 450);
    // Safety net: never leave the bar running if a navigation is cancelled.
    if (phase === 'loading') doneTimer.current = setTimeout(() => setState('done'), 15000);
  }, [phase]);

  return <div className={`nav-progress nav-progress--${phase}`} role="progressbar" aria-hidden={phase === 'idle'} aria-label="Loading page" aria-busy={phase === 'loading'}><span /></div>;
}

// Rendered inside the route tree: its effect runs only once the new page has committed.
export function NavigationDone() {
  const location = useLocation();
  useEffect(() => {
    committedPath = currentPath();
    if (state === 'loading') setState('done');
  }, [location.key]);
  return null;
}
