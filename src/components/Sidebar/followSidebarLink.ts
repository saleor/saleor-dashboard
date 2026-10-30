import { getAppMountUri } from "@dashboard/config";
import { type History } from "history";

interface LinkClick {
  button: number;
  metaKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  target: EventTarget | null;
  preventDefault: () => void;
}

const isPlainLeftClick = (event: LinkClick): boolean =>
  event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;

const getClickedAnchor = (event: LinkClick): HTMLAnchorElement | null => {
  if (!isPlainLeftClick(event) || !(event.target instanceof Element)) {
    return null;
  }

  const anchor = event.target.closest("a");

  if (!(anchor instanceof HTMLAnchorElement) || !anchor.href || anchor.target === "_blank") {
    return null;
  }

  return anchor.origin === window.location.origin ? anchor : null;
};

/** The router path behind an app link, or null when the link leaves the dashboard. */
const getRouterPath = (anchor: HTMLAnchorElement): string | null => {
  const basename = getAppMountUri().replace(/\/$/, "");
  const path = `${anchor.pathname}${anchor.search}${anchor.hash}`;

  if (!basename) {
    return path;
  }

  if (anchor.pathname !== basename && !anchor.pathname.startsWith(`${basename}/`)) {
    return null;
  }

  const routerPath = path.slice(basename.length);

  return routerPath.startsWith("/") ? routerPath : `/${routerPath}`;
};

/**
 * Follows a menu link through the app history. The collapsed submenu unmounts the link while
 * the click is still in progress, and the browser would otherwise load the page from scratch.
 */
export const followSidebarLink = (event: LinkClick, history: History): boolean => {
  const anchor = getClickedAnchor(event);
  const path = anchor && getRouterPath(anchor);

  if (!path) {
    return false;
  }

  event.preventDefault();

  const { pathname, search, hash } = history.location;

  if (path === `${pathname}${search}${hash}`) {
    history.replace(path);
  } else {
    history.push(path);
  }

  return true;
};
