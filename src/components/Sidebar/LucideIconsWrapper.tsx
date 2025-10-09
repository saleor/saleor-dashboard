import { Box } from "@saleor/macaw-ui-next";

export const LucideIconsWrapper = ({ children }: { children: React.ReactNode }) => (
  // Applying slight transform to center lucide icons vertically
  // TODO: remove when we use lucide icons everywhere in sidebar
  <Box __transform="translateX(-3.5px) translateY(-2px)">{children}</Box>
);
