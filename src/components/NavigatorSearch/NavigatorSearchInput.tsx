import { Box, InputProps, SearchIcon, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { QuickSearchMode } from "./types";

interface NavigatorSearchInputProps
  extends Omit<InputProps, "size" | "height" | "width" | "label"> {
  mode: QuickSearchMode;
}

const NavigatorSearchInput = React.forwardRef<HTMLInputElement, NavigatorSearchInputProps>(
  (props, ref) => {
    const { mode, ...rest } = props;
    const intl = useIntl();

    return (
      <Box display="flex" padding={4} height={12}>
        {mode !== "default" ? (
          <Text width={4} alignSelf="center" marginRight={1} textAlign="center">
            {mode === "orders"
              ? "#"
              : mode === "customers"
                ? "@"
                : mode === "catalog"
                  ? "$"
                  : mode === "help"
                    ? "?"
                    : ">"}
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
          placeholder={
            mode === "orders"
              ? intl.formatMessage({
                  id: "8B8E+3",
                  defaultMessage: "Order Number",
                  description: "navigator placeholder",
                })
              : mode === "commands"
                ? intl.formatMessage({
                    id: "NqxvFh",
                    defaultMessage: "Type Command",
                    description: "navigator placeholder",
                  })
                : mode === "catalog"
                  ? intl.formatMessage({
                      id: "AOI4LW",
                      defaultMessage: "Search in Catalog",
                      description: "navigator placeholder",
                    })
                  : mode === "customers"
                    ? intl.formatMessage({
                        id: "TpPx7V",
                        defaultMessage: "Search Customer",
                        description: "navigator placeholder",
                      })
                    : mode === "default"
                      ? intl.formatMessage(
                          {
                            id: "BooQvo",
                            defaultMessage: "Type {key} to see available actions",
                            description: "navigator placeholder",
                          },
                          {
                            key: "'?'",
                          },
                        )
                      : null
          }
          ref={ref}
          {...rest}
        />
      </Box>
    );
  },
);

NavigatorSearchInput.displayName = "NavigatorSearchInput";
export default NavigatorSearchInput;
