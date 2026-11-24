import { Box } from "@saleor/macaw-ui-next";

interface HorizontalSpacerProps {
  /** Multiples of the legacy 0.8rem spacing unit. */
  spacing?: number;
}

const HorizontalSpacer = ({ spacing = 1 }: HorizontalSpacerProps): JSX.Element => (
  <Box __width={`${0.8 * spacing}rem`} />
);

export default HorizontalSpacer;
