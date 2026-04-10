import { useLayoutEffect, useState } from 'react';

/**
 * Alto desde debajo del DrawerHeader hasta el borde inferior del viewport.
 * Evita usar main.clientHeight (a veces solo = alto del contenido → franja negra abajo).
 */
export function usePianoAreaHeight(enabled) {
  const [heightPx, setHeightPx] = useState(560);

  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const measure = () => {
      const main = document.querySelector('main');
      if (!main) return;
      const first = main.firstElementChild;
      if (!first) return;
      const bottom = first.getBoundingClientRect().bottom;
      const h = Math.max(240, window.innerHeight - bottom);
      setHeightPx(h);
    };

    measure();
    requestAnimationFrame(() => {
      requestAnimationFrame(measure);
    });

    const main = document.querySelector('main');
    const ro = main ? new ResizeObserver(measure) : null;
    if (main && ro) ro.observe(main);

    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener?.('resize', measure);
    window.visualViewport?.addEventListener?.('scroll', measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener?.('resize', measure);
      window.visualViewport?.removeEventListener?.('scroll', measure);
    };
  }, [enabled]);

  return heightPx;
}
