import { Grow, Paper, Popper } from "@material-ui/core";
import { IconButtonProps } from "@material-ui/core/IconButton";
import { LayoutButton, makeStyles, NavigatorIcon } from "@saleor/macaw-ui";
import { triangle } from "@saleor/styles/mixins";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    keyTile: {
      "&:first-child": {
        marginLeft: theme.spacing(),
      },
      alignItems: "center",
      background: theme.palette.background.default,
      borderRadius: 8,
      display: "inline-flex",
      height: 32,
      justifyContent: "center",
      marginLeft: theme.spacing(0.5),
      padding: theme.spacing(),
      width: 32,
    },
    keyTileLabel: {
      verticalAlign: "middle",
    },
    paper: {
      "&:after": {
        ...triangle(theme.palette.background.paper, 7),
        content: "''",
        left: 18,
        position: "absolute",
        top: -7,
      },
      "&:before": {
        ...triangle(theme.palette.divider, 8),
        content: "''",
        left: `calc(1px + ${theme.spacing(2)})`,
        position: "absolute",
        top: theme.spacing(-1),
      },
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 6,
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      position: "relative",
    },

    root: {
      "&:hover path": {
        color: theme.palette.primary.main,
      },
      marginRight: theme.spacing(2),
      width: 40,
    },
  }),
  {
    name: "NavigatorButton",
  },
);

export interface NavigatorButtonProps extends IconButtonProps {
  isMac: boolean;
}

const NavigatorButton: React.FC<NavigatorButtonProps> = ({
  className,
  isMac,
  ...props
}) => {
  const classes = useStyles({});
  const helperTimer = React.useRef(null);
  const [helperVisibility, setHelperVisibility] = React.useState(false);
  const anchor = React.useRef<HTMLButtonElement>();

  const setHelper = () => {
    helperTimer.current = setTimeout(() => setHelperVisibility(true), 2 * 1000);
  };

  const clearHelper = () => {
    if (helperTimer.current) {
      clearTimeout(helperTimer.current);
      helperTimer.current = null;
    }
    setHelperVisibility(false);
  };

  return (
    <>
      <LayoutButton
        className={classNames(className, classes.root)}
        data-test-id="navigator"
        onMouseEnter={setHelper}
        onMouseLeave={clearHelper}
        {...props}
        ref={anchor}
      >
        <NavigatorIcon />
      </LayoutButton>
      <Popper
        open={helperVisibility}
        anchorEl={anchor.current}
        transition
        placement="bottom-start"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom",
            }}
          >
            <Paper className={classes.paper} elevation={8}>
              <FormattedMessage id="EEW+ND" defaultMessage="Navigator" />
              <div className={classes.keyTile}>
                <span className={classes.keyTileLabel}>
                  {isMac ? "⌘" : "Ctrl"}
                </span>
              </div>
              <div className={classes.keyTile}>
                <span className={classes.keyTileLabel}>K</span>
              </div>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

NavigatorButton.displayName = "NavigatorButton";
export default NavigatorButton;
