import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router";

export const SearchShortcut = () => {
  const navigate = useNavigator();
  const location = useLocation();

  // Form tags and contenteditable are excluded by default, so typing "/" while writing is safe.
  useHotkeys("/", () => navigate("/search"), {
    enabled: !location.pathname.includes("/search"),
    useKey: true,
    preventDefault: true,
  });

  return (
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
};
