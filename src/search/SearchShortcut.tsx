import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useLocation } from "react-router";

export const SearchShortcut = () => {
  const navigate = useNavigator();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();

        if (!location.pathname.includes("/search")) {
          navigate("/search");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

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
