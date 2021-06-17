import { AppFragment } from "@saleor/fragments/types/AppFragment";
import { MutableRefObject, useEffect, useRef } from "react";
import urlJoin from "url-join";

export type UseAppConfigLoaderCallbacks = Record<
  "onLoad" | "onError",
  () => void
>;

function fixRelativeScriptSrc(origin: string) {
  return (node: HTMLScriptElement) => {
    // Using node.getAttribute beacuse node.src returns absolute path
    const src = node.getAttribute("src");
    if (src?.startsWith("/")) {
      node.src = urlJoin(origin, src);
    }
  };
}

async function _fetchAndSetContent(
  frameContainer: MutableRefObject<HTMLDivElement>,
  data: AppFragment,
  backendHost: string,
  { onError, onLoad }: UseAppConfigLoaderCallbacks
) {
  if (!frameContainer.current?.innerHTML && data?.configurationUrl) {
    try {
      const response = await fetch(data?.configurationUrl, {
        headers: {
          "x-saleor-domain": backendHost,
          "x-saleor-token": data.accessToken
        },
        method: "GET"
      });

      const url = new URL(response.url);
      const text = await response.text();
      const content = new DOMParser().parseFromString(text, "text/html");

      const frame = document.createElement("iframe");
      frame.src = "about:blank";
      frame.id = "extension-app";
      frameContainer.current.innerHTML = "";
      frameContainer.current.appendChild(frame);
      const frameContent = frame.contentWindow.document;

      const documentElement = content.documentElement;
      const scriptNodes = documentElement.querySelectorAll("script");

      scriptNodes.forEach(fixRelativeScriptSrc(url.origin));
      frameContent.write(content.documentElement.innerHTML);
      frameContent.close();
      frame.contentWindow.onload = onLoad;
    } catch (error) {
      console.error(error);
      onError();
    }
  }
}

function useAppConfigLoader(
  data: AppFragment,
  backendHost: string,
  callbacks: UseAppConfigLoaderCallbacks
) {
  const frameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    _fetchAndSetContent(frameContainer, data, backendHost, callbacks);
  }, [data]);

  return frameContainer;
}

export default useAppConfigLoader;
