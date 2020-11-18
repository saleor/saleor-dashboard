import navigatorIcon from "@assets/images/navigator.svg";
import Grow from "@material-ui/core/Grow";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classNames from "classnames";
import React from "react";
import ReactSVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => {
    const triangle = (color: string, width: number) => ({
      borderBottom: `${width}px solid ${color}`,
      borderLeft: `${width}px solid transparent`,
      borderRight: `${width}px solid transparent`,
      height: 0,
      width: 0
    });

    return {
      keyTile: {
        "&:first-child": {
          marginLeft: theme.spacing()
        },
        alignItems: "center",
        background: theme.palette.background.default,
        borderRadius: 8,
        display: "inline-flex",
        height: 32,
        justifyContent: "center",
        marginLeft: theme.spacing(0.5),
        padding: theme.spacing(),
        width: 32
      },
      keyTileLabel: {
        verticalAlign: "middle"
      },
      paper: {
        "&:after": {
          ...triangle(theme.palette.background.paper, 7),
          content: "''",
          left: theme.spacing(2) + 2,
          position: "absolute",
          top: -theme.spacing() + 1
        },
        "&:before": {
          ...triangle(theme.palette.divider, 8),
          content: "''",
          left: theme.spacing(2) + 1,
          position: "absolute",
          top: -theme.spacing()
        },
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 6,
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        position: "relative"
      },

      root: {
        "& path": {
          color: theme.palette.primary.main
        },
        "&:not(:hover)": {
          backgroundColor: theme.palette.background.paper
        },
        [theme.breakpoints.down("sm")]: {
          border: "none",
          borderRadius: 16
        },
        border: `1px solid ${theme.palette.divider}`,
        height: 40,
        marginRight: theme.spacing(2),
        padding: 6,
        width: 40
      }
    };
  },
  {
    name: "NavigatorButton"
  }
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
      <IconButton
        className={classNames(className, classes.root)}
        data-test="navigator"
        onMouseEnter={setHelper}
        onMouseLeave={clearHelper}
        {...props}
        ref={anchor}
      >
        <ReactSVG src={navigatorIcon} />
      </IconButton>
      <Popper
        open={helperVisibility}
        anchorEl={anchor.current}
        transition
        disablePortal
        placement="bottom-start"
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "right top" : "right bottom"
            }}
          >
            <Paper className={classes.paper} elevation={0}>
              <FormattedMessage defaultMessage="Navigator" />
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
