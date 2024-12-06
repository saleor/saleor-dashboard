import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";

import { RadioTileIndicator } from "./RadioTileIndicator";
import { getBgColor, getBorderColor, getHoverStateBgColor } from "./utils";

export interface RadioTileProps {
  checked: boolean;
  title: string;
  description: string;
  value: string;
  disabled?: boolean;
}

export const RadioTile = ({
  checked,
  title,
  description,
  value,
  disabled,
  ...props
}: RadioTileProps) => {
  const [isHoverState, setHoverState] = useState(false);

  return (
    <RadixRadioGroup.Item value={value} disabled={disabled} asChild {...props}>
      <Box
        position="relative"
        as="label"
        gap={2}
        display="grid"
        __gridTemplateColumns="auto 1fr"
        alignItems="center"
        borderColor={getBorderColor({ checked, isHoverState })}
        borderWidth={1}
        borderStyle="solid"
        borderRadius={2}
        padding={3}
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}
        cursor={disabled ? "not-allowed" : "pointer"}
      >
        <Box
          width={5}
          height={5}
          borderRadius="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor={getHoverStateBgColor({ checked, isHoverState })}
        >
          <Box
            width={3}
            height={3}
            boxShadow={checked || isHoverState ? "none" : "defaultFocused"}
            borderColor="default1"
            borderWidth={1}
            borderStyle={checked ? "none" : "solid"}
            borderRadius="100%"
            padding={0}
            backgroundColor={getBgColor({ checked, isHoverState })}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <RadioTileIndicator />
          </Box>
        </Box>
        <Text size={5} color={disabled ? "defaultDisabled" : "default1"}>
          {title}
        </Text>
        <Box />
        <Text size={1} color={disabled ? "defaultDisabled" : "default2"}>
          {description}
        </Text>
      </Box>
    </RadixRadioGroup.Item>
  );
};
