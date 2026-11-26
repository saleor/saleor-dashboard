/**
 * Visible mouse cursor + click ripple script injected via `context.addInitScript` during
 * video recordings. Headless Chromium draws no cursor, so this paints one from real mouse
 * events across the main document and iframes.
 */
export const CURSOR_INIT_SCRIPT = `(() => {
  if (window.__verifyDashboardCursor) return;
  window.__verifyDashboardCursor = true;
  const css = \`
    #__vd_cursor {
      position: fixed; left: 0; top: 0; width: 22px; height: 22px; z-index: 2147483647;
      pointer-events: none; opacity: 0; transition: transform 180ms ease-out, opacity 120ms;
      background: url("data:image/svg+xml,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path d="M3 2l14 9.5-6.2 1.2 3.7 6.8-2.6 1.4-3.7-6.8L3 18.5z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>',
      )}") no-repeat;
    }
    .__vd_ripple {
      position: fixed; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%;
      border: 3px solid rgba(37, 99, 235, 0.9); background: rgba(37, 99, 235, 0.25);
      z-index: 2147483646; pointer-events: none;
      animation: __vd_ripple 550ms ease-out forwards;
    }
    @keyframes __vd_ripple {
      from { transform: scale(0.3); opacity: 1; }
      to { transform: scale(1.6); opacity: 0; }
    }
  \`;
  const cursor = () => {
    let el = document.getElementById("__vd_cursor");
    if (el || !document.documentElement) return el;
    const style = document.createElement("style");
    style.textContent = css;
    el = document.createElement("div");
    el.id = "__vd_cursor";
    document.documentElement.append(style, el);
    return el;
  };
  const move = (e) => {
    const el = cursor();
    if (!el) return;
    el.style.transform = \`translate(\${e.clientX - 3}px, \${e.clientY - 2}px)\`;
    el.style.opacity = "1";
  };
  addEventListener("mousemove", move, true);
  addEventListener("mousedown", (e) => {
    move(e);
    const ripple = document.createElement("div");
    ripple.className = "__vd_ripple";
    Object.assign(ripple.style, { left: \`\${e.clientX}px\`, top: \`\${e.clientY}px\` });
    document.documentElement?.append(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, true);
  addEventListener("mouseover", (e) => {
    if (e.target instanceof HTMLIFrameElement) cursor()?.style.setProperty("opacity", "0");
  }, true);
  addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) cursor()?.style.setProperty("opacity", "0");
  }, true);
})();`;
