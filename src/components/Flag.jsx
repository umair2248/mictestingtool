// Small inline flags. Emoji flags show up as plain letters on Windows, so these are drawn as SVG.
const star = (x, y, r) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 ? r * 0.4 : r;
    points.push(`${(x + radius * Math.cos(angle)).toFixed(2)},${(y + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(' ');
};

const flags = {
  en: <>
    {[0, 1, 2, 3, 4, 5, 6].map(i => <rect key={i} y={i * 20 / 6.5} width="30" height={20 / 13} fill="#b22234"/>)}
    <rect width="13" height={20 * 7 / 13} fill="#3c3b6e"/>
    {[2.2, 6.5, 10.8].flatMap(x => [2.2, 5.3, 8.4].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" fill="#fff"/>))}
  </>,
  id: <><rect width="30" height="10" fill="#ce1126"/><rect y="10" width="30" height="10" fill="#fff"/></>,
  pl: <><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#dc143c"/></>,
  cs: <><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#d7141a"/><path d="M0 0 L15 10 L0 20 Z" fill="#11457e"/></>,
  fr: <><rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/></>,
  de: <><rect width="30" height="7" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/></>,
  tr: <><rect width="30" height="20" fill="#e30a17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.3" cy="10" r="4" fill="#e30a17"/><polygon points={star(18.2, 10, 2.4)} fill="#fff"/></>,
  es: <><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></>,
  'zh-Hans': <><rect width="30" height="20" fill="#de2910"/><polygon points={star(5, 5, 3)} fill="#ffde00"/>{[[10, 2], [12, 4], [12, 7], [10, 9]].map(([x, y]) => <polygon key={`${x}-${y}`} points={star(x, y, 1)} fill="#ffde00"/>)}</>,
};

export default function Flag({ code }) {
  if (!flags[code]) return null;
  return <svg className="flag" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true" focusable="false">{flags[code]}</svg>;
}
