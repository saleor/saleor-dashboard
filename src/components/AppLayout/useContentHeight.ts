// @ts-strict-ignore
import { borderHeight, savebarHeight, topBarHeight } from "./consts";

export const useContentHeight = () => {
  const withoutSaveBar = () =>
    `calc(100vh - ${topBarHeight} - ${borderHeight})`;

  const withSaveBar = ({ noTopNav }) => {
    const topHeight = noTopNav ? "0px" : topBarHeight;

    return `calc(100vh - ${topHeight} - ${savebarHeight} - ${borderHeight})`;
  };

  return { withoutSaveBar, withSaveBar };
};
