import { DeprecationBannerContent, DeprecationBannerIcon } from "./DeprecationBannerContent";
import { useDeprecationBanner } from "./useDeprecationBanner";

export const DeprecationBanner = ({ compact = false }: { compact?: boolean }) => {
  const state = useDeprecationBanner();

  if (!state) {
    return null;
  }

  if (compact) {
    return <DeprecationBannerIcon upgradeDate={state.upgradeDate} />;
  }

  return <DeprecationBannerContent upgradeDate={state.upgradeDate} />;
};
