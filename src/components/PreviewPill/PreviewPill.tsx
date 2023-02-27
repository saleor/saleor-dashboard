import { Grow, Paper, Popper, Typography } from "@material-ui/core";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";
import useStyles from "./styles";

export interface PreviewPillProps {
  className?: string;
}

export const PreviewPill: React.FC<PreviewPillProps> = ({ className }) => {
  const intl = useIntl();
  const [active, setActive] = React.useState(false);
  const anchor = React.useRef<HTMLDivElement>(null);
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
              <Typography className={classes.tooltipText}>
                {intl.formatMessage(messages.tooltip)}
              </Typography>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

PreviewPill.displayName = "PreviewPill";
export default PreviewPill;
