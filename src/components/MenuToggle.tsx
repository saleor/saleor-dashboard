import React from "react";

interface MenuToggleProps {
  ariaOwns?: string;
  children: (props: {
    actions: {
      open: () => void;
      close: () => void;
    };
    open: boolean;
  }) => React.ReactElement<any>;
}

interface MenuToggleState {
  open: boolean;
}

class MenuToggle extends React.Component<MenuToggleProps, MenuToggleState> {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return children({
      actions: { close: this.handleClose, open: this.handleClick },
      open,
    });
  }
}

export default MenuToggle;
