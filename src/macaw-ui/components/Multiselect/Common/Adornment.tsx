import { sprinkles } from "~/theme";
import { classNames } from "~/utils";

import { SVGWrapperProps } from "~/components/Icons/SVGWrapper";
import { toggleIconStyle } from "../../BaseSelect";
import { ArrowDownIcon } from "../../Icons";
import { RenderEndAdornmentType, useMultiselect } from "./useMultiselect";

export type AdornmentProps = {
  size?: "small" | "medium" | "large";
  getToggleButtonProps: ReturnType<
    typeof useMultiselect
  >["getToggleButtonProps"];
  renderEndAdornment?: RenderEndAdornmentType;
  disabled?: boolean;
};

export const Adornment = ({
  size,
  getToggleButtonProps,
  renderEndAdornment,
  disabled,
}: AdornmentProps) => {
  return renderEndAdornment ? (
    <>{renderEndAdornment(getToggleButtonProps())}</>
  ) : (
    <ArrowDownIcon
      className={classNames(toggleIconStyle, sprinkles({ cursor: "pointer" }))}
      size={size}
      // TODO: We should instead wrap icon with button for correct HTML structure
      // this function returns handlers for <button> element not <svg>
      {...(getToggleButtonProps({ disabled }) as SVGWrapperProps)}
    />
  );
};
