import { DeprecationBannerContent } from "./DeprecationBannerContent";
import { useDeprecationBanner } from "./useDeprecationBanner";

export const DeprecationBanner = () => {
  const state = useDeprecationBanner();

  if (!state) {
    return null;
  }

  return <DeprecationBannerContent upgradeDate={state.upgradeDate} />;
};
