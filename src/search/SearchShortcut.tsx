import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const FOCUSABLE_ELEMENTS = ["input", "textarea", "select", '[contenteditable="true"]'].join(", ");

export const SearchShortcut = () => {
  const navigate = useNavigator();
  const location = useLocation();
  const focusActive = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;

      if (location.pathname.includes("/search")) return;

      if (focusActive.current) return;

      event.preventDefault();
      navigate("/search");
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && e.target.matches(FOCUSABLE_ELEMENTS)) {
        focusActive.current = true;
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement && e.target.matches(FOCUSABLE_ELEMENTS)) {
        focusActive.current = false;
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [navigate, focusActive.current]);

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
