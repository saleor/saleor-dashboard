import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
  theme => ({
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
    }
  }),
  {
    name: "ExpandButton"
  }
);

const SquareButton: React.FC<ButtonBaseProps> = ({ className, ...rest }) => {
  const classes = useStyles({});

  return (
    <ButtonBase className={classNames(classes.root, className)} {...rest} />
  );
};

SquareButton.displayName = "SquareButton";
export default SquareButton;
