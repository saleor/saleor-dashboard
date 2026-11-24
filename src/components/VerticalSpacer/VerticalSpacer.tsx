import { Box } from "@saleor/macaw-ui-next";

interface VerticalSpacerProps {
  /** Multiples of the legacy 0.8rem spacing unit. */
  spacing?: number;
}

const VerticalSpacer = ({ spacing = 1 }: VerticalSpacerProps): JSX.Element => (
  <Box __height={`${0.8 * spacing}rem`} />
);

export default VerticalSpacer;
