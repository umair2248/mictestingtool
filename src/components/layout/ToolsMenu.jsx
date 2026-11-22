import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { allTools, toolGroups } from '../../data/navigation';
import ToolIcon from './ToolIcon';
import '../../styles/tools-menu.css';

// Desktop "Tools" dropdown. Opens on hover for a mouse, and on click or keyboard for everyone else.
export default function ToolsMenu({ label, lang }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const closeTimer = useRef();
  const openedAt = useRef(0);
  const { pathname } = useLocation();
  const current = allTools.some(tool => tool.to === pathname);
  const close = useCallback((focus = false) => { setOpen(false); if (focus) trigger.current?.focus(); }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const key = event => { if (event.key === 'Escape') { event.preventDefault(); close(true); } };
    const outside = event => { if (!root.current?.contains(event.target)) close(); };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [open, close]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const enter = event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    setOpen(was => { if (!was) openedAt.current = Date.now(); return true; });
  };
  const leave = event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };
  // A click right after hover opened the menu keeps it open instead of closing it again.
  const toggle = () => { clearTimeout(closeTimer.current); setOpen(was => was && Date.now() - openedAt.current < 600 ? true : !was); };

  return <li ref={root} className="tools-menu" onPointerEnter={enter} onPointerLeave={leave} onBlur={event => { if (open && !root.current?.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} type="button" lang={lang} className={`tools-menu__trigger${current ? ' is-current' : ''}`} aria-expanded={open} aria-controls="tools-menu-panel" onClick={toggle}>
      {label}<ChevronDown size={16} aria-hidden="true" className="tools-menu__caret"/>
    </button>
    <div id="tools-menu-panel" className="tools-menu__panel" hidden={!open}>
      <div className="tools-menu__groups">{toolGroups.map(group => <div key={group.title} className="tools-menu__group">
        <p className="tools-menu__heading">{group.title}</p>
        <ul>{group.tools.map(tool => <li key={tool.to}><NavLink to={tool.to} end className="tools-menu__link" onClick={() => close()}>
          <span className="tools-menu__icon"><ToolIcon name={tool.icon}/></span>
          <span className="tools-menu__copy"><span className="tools-menu__name">{tool.label}{tool.isNew && <span className="tools-menu__badge">New</span>}</span><span className="tools-menu__text">{tool.text}</span></span>
        </NavLink></li>)}</ul>
      </div>)}</div>
      <div className="tools-menu__footer"><span>{allTools.length} free tools. They all run in your browser, with no sign-up.</span><Link to="/blog" onClick={() => close()}>Setup and fix guides <ArrowRight size={16} aria-hidden="true"/></Link></div>
    </div>
  </li>;
}
