// @ts-strict-ignore
import { useEffect } from "react";

/**
 * Glide automatically refers to the div with an id "portal"
 * This hook allows to add additional classes for it
 */
const portalRoot = document.getElementById("portal");

export const usePortalClasses = ({ className }: { className: string }) => {
  useEffect(() => {
    portalRoot.classList.add(className);
  }, []);
};
