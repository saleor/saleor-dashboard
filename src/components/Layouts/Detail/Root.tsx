import {
  borderHeight,
  contentMaxWidth,
  savebarHeight,
} from "@dashboard/components/AppLayout/consts";
import { useMediaQuery } from "@dashboard/hooks/useMediaQuery";
import { Box, Sprinkles } from "@saleor/macaw-ui/next";
import React, { useMemo } from "react";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  gridTemplateColumns?: Sprinkles["gridTemplateColumns"];
  withSavebar?: boolean;
}

const contentWithSidebarHeight = `calc(100vh - ${savebarHeight} - ${borderHeight} * 2)`;
const contentWithoutSidebarHeight = `calc(100vh - ${borderHeight}`;

export const RootLayout: React.FC<DetailPageLayoutProps> = ({
  children,
  gridTemplateColumns = 12,
  withSavebar = true,
}) => {
  const matches = useMediaQuery("(min-width: 1024px)");

  const gridTemplateColumnsValue =
    useMemo((): Sprinkles["gridTemplateColumns"] => {
      if (gridTemplateColumns instanceof Object) {
        return {
          mobile: gridTemplateColumns.mobile ?? 1,
          ...gridTemplateColumns,
        };
      }

      return {
        mobile: 1,
        desktop: gridTemplateColumns,
      };
    }, [gridTemplateColumns]);

  const heightValue = useMemo(() => {
    if (matches) {
      return withSavebar
        ? contentWithSidebarHeight
        : contentWithoutSidebarHeight;
    }

    return "auto";
  }, [matches, withSavebar]);

  return (
    <Box
      display="grid"
      margin="auto"
      gridTemplateColumns={gridTemplateColumnsValue}
      __gridTemplateRows="auto 1fr"
      __maxWidth={contentMaxWidth}
      __height={heightValue}
    >
      {children}
    </Box>
  );
};
