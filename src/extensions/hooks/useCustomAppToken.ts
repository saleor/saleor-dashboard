import { useState } from "react";

/** This hook is for custom app installation
 * when installing custom app we want to display it's token
 * right after installation, **and only once** due to security concerns
 *
 * Because of that we cannot store it anywhere, it must be a state stored in a router
 * when navigating between views */
export const useCustomAppToken = () => {
  const [customAppToken, setCustomAppToken] = useState<string | null>(null);

  return {
    customAppToken,
    setCustomAppToken,
  };
};
