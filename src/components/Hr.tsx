import { Box } from "@macaw-ui";

/**
 * @deprecated use `Divider` component from `@macaw-ui`
 */
export const Hr = ({ className }: { className?: string }) => (
  <Box
    as="hr"
    className={className}
    backgroundColor="default3"
    borderWidth={0}
    width="100%"
    height="px"
  />
);

Hr.displayName = "Hr";
export default Hr;
