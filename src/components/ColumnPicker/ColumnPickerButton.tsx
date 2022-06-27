import { fade } from "@material-ui/core/styles/colorManipulator";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { Button } from "@saleor/components/Button";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ColumnPickerButtonProps {
  active: boolean;
  className?: string;
  onClick: () => void;
}

const useStyles = makeStyles(
  theme => ({
    icon: {
      marginLeft: theme.spacing(2),
      transition: theme.transitions.duration.short + "ms",
    },
    root: {
      "& span": {
        color: theme.palette.primary.main,
      },
      paddingRight: theme.spacing(1),
    },
    rootActive: {
      background: fade(theme.palette.primary.main, 0.1),
    },
    rotate: {
      transform: "rotate(180deg)",
    },
  }),
  {
    name: "ColumnPickerButton",
  },
);

const ColumnPickerButton: React.FC<ColumnPickerButtonProps> = props => {
  const { active, className, onClick } = props;
  const classes = useStyles(props);

  return (
    <Button
      className={classNames(classes.root, className, {
        [classes.rootActive]: active,
      })}
      onClick={onClick}
      variant="secondary"
    >
      <FormattedMessage
        id="142MJn"
        defaultMessage="Columns"
        description="select visible columns button"
      />
      <ArrowDropDownIcon
        className={classNames(classes.icon, {
          [classes.rotate]: active,
        })}
      />
    </Button>
  );
};

export default ColumnPickerButton;
