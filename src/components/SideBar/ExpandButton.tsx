import { ButtonProps } from "@material-ui/core/Button";
import ArrowIcon from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React from "react";

import SquareButton from "../SquareButton";

const useStyles = makeStyles(
  theme => ({
    arrow: {
      transition: theme.transitions.duration.shortest + "ms"
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

const ExpandButton: React.FC<ExpandButtonProps> = ({ isShrunk, ...rest }) => {
  const classes = useStyles({});

  return (
    <SquareButton {...rest}>
      <ArrowIcon
        className={classNames(classes.arrow, {
          [classes.shrunk]: isShrunk
        })}
      />
    </SquareButton>
  );
};

ExpandButton.displayName = "ExpandButton";
export default ExpandButton;
