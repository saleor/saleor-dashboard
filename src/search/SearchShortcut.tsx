import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router";

/**
 * Registered with the menu, not the hint: the collapsed rail renders the Search label twice
 * (accessible name and tooltip), which would navigate twice per key press.
 */
export const useSearchHotkey = ({ enabled }: { enabled: boolean }) => {
  const navigate = useNavigator();
  const location = useLocation();

  // Form tags and contenteditable are excluded by default, so typing "/" while writing is safe.
  useHotkeys("/", () => navigate("/search"), {
    enabled: enabled && !location.pathname.includes("/search"),
    useKey: true,
    preventDefault: true,
  });
};

export const SearchShortcut = () => (
  <Box
    borderColor="default1"
    borderStyle="solid"
    borderWidth={1}
    paddingX={1.5}
    borderRadius={2}
    fontWeight="medium"
    fontSize={2}
    textAlign="center"
    boxShadow="defaultFocused"
  >
    /
  </Box>
);
