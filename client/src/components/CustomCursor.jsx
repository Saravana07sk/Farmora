import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    const onMove = (event) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const interactive = event.target.closest('a, button, input, textarea, select, [role="button"]');
      ring.classList.toggle('is-hot', Boolean(interactive));
    };

    let frame = 0;
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      frame = window.requestAnimationFrame(loop);
    };

    document.body.classList.add('agri-has-cursor');
    window.addEventListener('pointermove', onMove, { passive: true });
    loop();

    return () => {
      document.body.classList.remove('agri-has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="agri-cursor" />
      <div ref={ringRef} className="agri-cursor-ring" />
    </>
  );
};

export default CustomCursor;
