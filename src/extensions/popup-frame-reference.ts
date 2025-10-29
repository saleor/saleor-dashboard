import { atom, useAtom } from "jotai";

const popupIframeRef = atom<
  Map<
    HTMLIFrameElement,
    {
      loaded: boolean;
    }
  >
>(new Map());

// todo rename to multiple frames, not popup only
export const usePopupFrameReference = () => {
  const [iframes, setIframe] = useAtom(popupIframeRef);

  return {
    iframes,
    setIframe(frame: HTMLIFrameElement, loaded: boolean) {
      setIframe(prev => {
        prev.set(frame, {
          loaded: loaded,
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
