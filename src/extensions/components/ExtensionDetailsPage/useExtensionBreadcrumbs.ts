import { useEffect, useState } from "react";

interface Breadcrumb {
  label: string;
  value: string;
}

type UseExtensionBreadcrumbs = [Breadcrumb[], (value: string) => void];
function useExtensionBreadcrumbs(): UseExtensionBreadcrumbs {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const handleBreadcrumbSet = (event: MessageEvent) => {
    if (event.data.type === "breadcrumbs") {
      setBreadcrumbs(event.data.breadcrumbs);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleBreadcrumbSet);

    return () => window.removeEventListener("message", handleBreadcrumbSet);
  }, []);

  const handleBreadcrumbClick = (value: string) => {
    // If iframe is embedded, tell it to navigate
    const appFrame: HTMLIFrameElement = document.querySelector(
      "#extension-app"
    );

    if (!!appFrame) {
      appFrame.contentWindow.postMessage(
        {
          type: "breadcrumb-click",
          value
        },
        "*"
      );
    }
  };

  return [breadcrumbs, handleBreadcrumbClick];
}

export default useExtensionBreadcrumbs;
