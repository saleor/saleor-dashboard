import { Box, InputProps, SearchIcon, sprinkles, Text } from "@saleor/macaw-ui-next";
import { forwardRef } from "react";
import { useIntl } from "react-intl";

import { getModePlaceholder, getModeSymbol } from "./modes/utils";
import { QuickSearchMode } from "./types";

interface NavigatorSearchInputProps
  extends Omit<InputProps, "size" | "height" | "width" | "label" | "as" | "type" | "color"> {
  mode: QuickSearchMode;
}

const NavigatorSearchInput = forwardRef<HTMLInputElement, NavigatorSearchInputProps>(
  (props, ref) => {
    const { mode, ...rest } = props;
    const intl = useIntl();

    return (
      <Box display="flex" padding={4} height={12}>
        {mode !== "default" ? (
          <Text width={4} alignSelf="center" marginRight={1} textAlign="center">
            {getModeSymbol(mode)}
          </Text>
        ) : (
          <SearchIcon
            size="small"
            className={sprinkles({
              alignSelf: "center",
              marginRight: 2,
            })}
          />
        )}
        <Box
          as="input"
          role="input"
          autoFocus
          autoComplete="off"
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            backgroundColor: "transparent",
            padding: 0,
          }}
          placeholder={getModePlaceholder(mode, intl) ?? undefined}
          ref={ref}
          {...rest}
        />
      </Box>
    );
  },
);

NavigatorSearchInput.displayName = "NavigatorSearchInput";
export default NavigatorSearchInput;
