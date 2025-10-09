import { Box } from "@saleor/macaw-ui-next";

// Constants for Lucide icon transform offsets
const LUCIDE_ICON_TRANSLATE_X = -3.5;
const LUCIDE_ICON_TRANSLATE_Y = -2;

export const LucideIconsWrapper = ({ children }: { children: React.ReactNode }) => (
  // Applying slight transform to center lucide icons vertically
  // TODO: remove when we use lucide icons everywhere in sidebar
  <Box
    __transform={`translateX(${LUCIDE_ICON_TRANSLATE_X}px) translateY(${LUCIDE_ICON_TRANSLATE_Y}px)`}
  >
    {children}
  </Box>
);
