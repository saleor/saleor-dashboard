import {
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";
import { Button } from "@saleor/components/Button";
import React from "react";

import { useStyles } from "./styles";

interface Option {
  label: string;
  disabled?: boolean;
  onSelect(e: React.MouseEvent<HTMLLIElement, MouseEvent>): void;
}

export interface ButtonWithSelectProps
  extends Omit<ButtonGroupProps, "onClick">,
    Pick<ButtonProps, "onClick"> {
  options: Option[];
  href?: string;
}

export const ButtonWithSelect: React.FC<ButtonWithSelectProps> = ({
  options,
  children,
  href,
  onClick,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const classes = useStyles();

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void,
  ) => {
    onClick(event);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup ref={anchorRef} aria-label="button with select" {...props}>
        <Button
          variant="primary"
          color="primary"
          onClick={onClick}
          href={href}
          style={{ width: "100%" }}
        >
          {children}
        </Button>
        {options.length > 0 && (
          <Button
            variant="primary"
            color="primary"
            aria-controls={open ? "button-with-select-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select different option"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon className={classes.buttonIcon} />
          </Button>
        )}
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="bottom-end"
        className={classes.popper}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="button-with-select-menu">
                  {options.map((option, i) => (
                    <MenuItem
                      key={option.label + i}
                      disabled={option.disabled}
                      onClick={e => handleMenuItemClick(e, option.onSelect)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
