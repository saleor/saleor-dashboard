import { atom, useAtom } from "jotai";

const popupIframeRef = atom<
  Map<
    HTMLIFrameElement,
    {
      loaded: boolean;
      target: "POPUP" | "WIDGET" | "APP_PAGE";
    }
  >
>(new Map());

// todo rename to multiple frames, not popup only
export const useAppFrameReferences = () => {
  const [iframes, setIframe] = useAtom(popupIframeRef);

  return {
    iframes,
    setIframe(frame: HTMLIFrameElement, loaded: boolean, target: "POPUP" | "WIDGET" | "APP_PAGE") {
      setIframe(prev => {
        prev.set(frame, {
          loaded: loaded,
          target,
        });

        return new Map(prev);
      });
    },
    clearIframe: (frame: HTMLIFrameElement) =>
      setIframe(prev => {
        prev.delete(frame);

        return new Map(prev);
      }),
  };
};
