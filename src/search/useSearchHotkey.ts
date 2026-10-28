import useNavigator from "@dashboard/hooks/useNavigator";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router";

/**
 * Register once per app. The hint and the menu can each be rendered more than once (the rail
 * renders labels twice, and its drawer mounts a second menu), and the menu is not mounted at all
 * while the phone drawer is closed.
 */
export const useSearchHotkey = ({ enabled }: { enabled: boolean }): void => {
  const navigate = useNavigator();
  const location = useLocation();

  // Form tags and contenteditable are excluded by default, so typing "/" while writing is safe.
  useHotkeys("/", () => navigate("/search"), {
    enabled: enabled && !location.pathname.includes("/search"),
    useKey: true,
    preventDefault: true,
  });
};
