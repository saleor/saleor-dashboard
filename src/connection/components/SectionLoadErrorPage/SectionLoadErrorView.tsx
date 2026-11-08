import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { connectionMonitor as appConnectionMonitor } from "../../appConnectionMonitor";
import { type ConnectionMonitor, isOutage, useConnectionState } from "../../connectionMonitor";
import { useBrowserOnline } from "../../useBrowserOnline";
import { SectionLoadErrorPage } from "./SectionLoadErrorPage";

const reloadPage = (): void => window.location.reload();

interface SectionLoadErrorViewProps {
  /** Shows whatever the merchant opens next in place of this page. */
  onLeave: () => void;
  monitor?: ConnectionMonitor;
  reload?: () => void;
}

/**
 * Shown in place of a section whose code couldn't be downloaded, usually because the connection
 * dropped. Only a reload can open it, since browsers keep a failed download failed. Nothing on
 * this page can be lost, so it reloads by itself once an outage ends.
 */
export const SectionLoadErrorView = ({
  onLeave,
  monitor = appConnectionMonitor,
  reload = reloadPage,
}: SectionLoadErrorViewProps): React.ReactNode => {
  const { status } = useConnectionState(monitor);
  // The banner waits two seconds to see whether a drop lasts; this page has no reason to offer
  // a reload meanwhile, which would only show the browser's own offline page.
  const browserOnline = useBrowserOnline();
  const { pathname } = useLocation();
  const [failedPathname] = useState(pathname);

  // Sections opened before still work offline, so leaving shows them instead of this page.
  useEffect(
    function showNextPage() {
      if (pathname !== failedPathname) {
        onLeave();
      }
    },
    [failedPathname, onLeave, pathname],
  );

  useEffect(
    function reloadOnceConnected() {
      return monitor.subscribe(event => {
        if (event.type === "recovered" && event.afterOutage) {
          reload();
        }
      });
    },
    [monitor, reload],
  );

  return (
    <SectionLoadErrorPage connectionLost={!browserOnline || isOutage(status)} onReload={reload} />
  );
};
