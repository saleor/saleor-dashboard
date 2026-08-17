import { Box } from "@saleor/macaw-ui-next";

import styles from "./TimelineStem.module.css";

interface TimelineStemProps {
  top?: string | number;
  bottom?: string | number;
  "data-test-id"?: string;
}

/** Shared vertical connector for timeline note input + events. */
export const TimelineStem = ({
  top,
  bottom,
  "data-test-id": dataTestId,
}: TimelineStemProps): JSX.Element => (
  <Box
    as="span"
    className={styles.stem}
    aria-hidden
    data-test-id={dataTestId}
    __top={top}
    __bottom={bottom}
    // Prefer macaw token over CSS var — same paint as legacy event stems.
    backgroundColor="default1Hovered"
  />
);
