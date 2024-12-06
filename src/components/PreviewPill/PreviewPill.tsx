import { Grow, Paper, Popper } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useState, useRef } from "react";
import { useIntl } from "react-intl";

import { Pill } from "../Pill";
import messages from "./messages";
import useStyles from "./styles";

export interface PreviewPillProps {
  className?: string;
}

export const PreviewPill = ({ className }: PreviewPillProps) => {
  const intl = useIntl();
  const [active, setActive] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  return (
    <>
      <Pill
        className={className}
        active={active}
        color="warning"
        size="small"
        label={intl.formatMessage(messages.label)}
        ref={anchor}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      />
      <Popper
        className={classes.popper}
        open={active}
        anchorEl={anchor.current}
        transition
        placement="bottom-start"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={16} className={classes.tooltip}>
              <Text className={classes.tooltipText}>{intl.formatMessage(messages.tooltip)}</Text>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

PreviewPill.displayName = "PreviewPill";
export default PreviewPill;
