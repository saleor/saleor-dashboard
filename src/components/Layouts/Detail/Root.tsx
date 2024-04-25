import { borderHeight, savebarHeight } from "@dashboard/components/AppLayout/consts";
import { Box, Sprinkles } from "@saleor/macaw-ui-next";
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
  const gridTemplateColumnsValue = useMemo((): Sprinkles["gridTemplateColumns"] => {
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
    return withSavebar ? contentWithSidebarHeight : contentWithoutSidebarHeight;
  }, [withSavebar]);

  return (
    <Box
      // TODO: Use custom value media query when it will be ready
      // https://github.com/saleor/macaw-ui/issues/498
      className="mobile-full-height"
      display="grid"
      gridTemplateColumns={gridTemplateColumnsValue}
      __gridTemplateRows="auto 1fr"
      __height={heightValue}
    >
      {children}
    </Box>
  );
};
