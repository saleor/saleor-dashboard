import { ButtonProps } from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowIcon from "@material-ui/icons/ArrowBack";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.duration.shortest + "ms"
    },
    root: {
      "&:hover, &:focus": {
        background: "#daedeb"
      },
      background: theme.palette.background.paper,
      borderRadius: 16,
      color: theme.palette.primary.main,
      height: 48,
      transition: theme.transitions.duration.shortest + "ms",
      width: 48
    },
    shrunk: {
      transform: "scaleX(-1)"
    }
  }),
  {
    name: "ExpandButton"
  }
);

export interface ExpandButtonProps extends ButtonProps {
  isShrunk: boolean;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({
  className,
  isShrunk,
  ...rest
}) => {
  const classes = useStyles({});

  return (
    <ButtonBase className={classNames(classes.root, className)} {...rest}>
      <ArrowIcon
        className={classNames(classes.arrow, {
          [classes.shrunk]: isShrunk
        })}
      />
    </ButtonBase>
  );
};

ExpandButton.displayName = "ExpandButton";
export default ExpandButton;
