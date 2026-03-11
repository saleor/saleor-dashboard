import { borderHeight, savebarHeight } from "@dashboard/components/AppLayout/consts";
import { Box, type Sprinkles } from "@macaw-ui";
import type * as React from "react";
import { useMemo } from "react";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  gridTemplateColumns?: Sprinkles["gridTemplateColumns"];
  withSavebar?: boolean;
  testId?: string;
}

const contentWithSidebarHeight = `calc(100vh - ${savebarHeight} - ${borderHeight} * 2)`;
const contentWithoutSidebarHeight = `calc(100vh - ${borderHeight}`;

export const RootLayout = ({
  children,
  gridTemplateColumns = 12,
  withSavebar = true,
  testId,
  ...props
}: DetailPageLayoutProps) => {
  const gridTemplateColumnsValue = useMemo(() => {
    if (
      gridTemplateColumns &&
      typeof gridTemplateColumns === "object" &&
      "mobile" in gridTemplateColumns
    ) {
      return {
        mobile: (gridTemplateColumns as { mobile?: number }).mobile ?? 1,
        tablet: (gridTemplateColumns as { tablet?: number }).tablet,
        desktop: (gridTemplateColumns as { desktop?: number }).desktop,
      };
    }

    return {
      mobile: 1,
      tablet: gridTemplateColumns as number,
      desktop: gridTemplateColumns as number,
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
      data-test-id={testId}
      {...props}
    >
      {children}
    </Box>
  );
};
