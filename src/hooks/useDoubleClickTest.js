import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_THRESHOLD, buttonFor, createStats, recordDown, recordUp } from '../utils/clickAnalysis';

const LOG_SIZE = 12;

export default function useDoubleClickTest() {
  const [stats, setStats] = useState(createStats);
  const [log, setLog] = useState([]);
  const [pressed, setPressed] = useState({});
  const [wheel, setWheel] = useState({ up: 0, down: 0 });
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const statsRef = useRef(stats);
  const thresholdRef = useRef(threshold);
  const areaRef = useRef(null);
  const counter = useRef(0);

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);

  const onMouseDown = useCallback(event => {
    const button = buttonFor(event.button);
    if (!button) return;
    if (event.button !== 0) event.preventDefault();
    const { stats: next, event: info } = recordDown(statsRef.current, button.key, event.timeStamp, thresholdRef.current);
    statsRef.current = next;
    setStats(next);
    setPressed(current => ({ ...current, [button.key]: true }));
    counter.current += 1;
    setLog(current => [{ id: counter.current, label: button.label, ...info }, ...current].slice(0, LOG_SIZE));
  }, []);

  const onMouseUp = useCallback(event => {
    const button = buttonFor(event.button);
    if (!button) return;
    // Stops the browser going back or forward when the side buttons are tested.
    if (event.button > 2) event.preventDefault();
    statsRef.current = recordUp(statsRef.current, button.key, event.timeStamp);
    setStats(statsRef.current);
    setPressed(current => ({ ...current, [button.key]: false }));
  }, []);

  const onContextMenu = useCallback(event => event.preventDefault(), []);
  const onMouseLeave = useCallback(() => setPressed({}), []);

  // Native listeners: React's wheel handler is passive, and the side buttons need preventDefault on auxclick too.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return undefined;
    const wheelHandler = event => {
      event.preventDefault();
      if (event.deltaY === 0) return;
      setWheel(current => event.deltaY < 0 ? { ...current, up: current.up + 1 } : { ...current, down: current.down + 1 });
    };
    const auxHandler = event => { if (event.button > 2) event.preventDefault(); };
    area.addEventListener('wheel', wheelHandler, { passive: false });
    area.addEventListener('auxclick', auxHandler);
    return () => { area.removeEventListener('wheel', wheelHandler); area.removeEventListener('auxclick', auxHandler); };
  }, []);

  const reset = useCallback(() => {
    statsRef.current = createStats();
    setStats(statsRef.current);
    setLog([]);
    setPressed({});
    setWheel({ up: 0, down: 0 });
  }, []);

  return { stats, log, pressed, wheel, threshold, setThreshold, reset, areaRef, handlers: { onMouseDown, onMouseUp, onContextMenu, onMouseLeave } };
}
