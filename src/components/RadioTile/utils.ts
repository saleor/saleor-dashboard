interface RadioTileState {
  checked: boolean;
  isHoverState: boolean;
}

export const getHoverStateBgColor = ({
  checked,
  isHoverState,
}: RadioTileState) => {
  if (checked && isHoverState) {
    return "accent1Hovered";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "transparent";
};

export const getBorderColor = ({ checked, isHoverState }: RadioTileState) => {
  if (checked) {
    return "accent1";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "default1";
};

export const getBgColor = ({ checked, isHoverState }: RadioTileState) => {
  if (checked) {
    return "accent1";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "transparent";
};
