import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Box, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface RadioTileProps {
  checked: boolean;
  title: string;
  description: string;
  value: string;
}

interface RadioTileState {
  checked: boolean;
  isHoverState: boolean;
}

const getHoverState = ({ checked, isHoverState }: RadioTileState) => {
  if (checked && isHoverState) {
    return "accent1Hovered";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "transparent";
};

const getBorderColor = ({ checked, isHoverState }: RadioTileState) => {
  if (checked) {
    return "accent1";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "default1";
};

const getBgColor = ({ checked, isHoverState }: RadioTileState) => {
  if (checked) {
    return "accent1";
  }
  if (isHoverState) {
    return "default1Hovered";
  }
  return "transparent";
};

export const RadioTile = ({
  checked,
  title,
  description,
  value,
}: RadioTileProps) => {
  // State to track hover status
  const [isHoverState, setHoverState] = React.useState(false);

  return (
    <RadixRadioGroup.Item value={value} asChild>
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
        cursor="pointer"
        onMouseEnter={() => setHoverState(true)}
        onMouseLeave={() => setHoverState(false)}
      >
        <Box
          width={5}
          height={5}
          borderRadius="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor={getHoverState({ checked, isHoverState })}
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
            <RadixRadioGroup.Indicator
              className={sprinkles({
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "buttonDefaultPrimary",
                height: "100%",
                width: "100%",
                borderRadius: "100%",
              })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="6"
                fill="white"
              >
                <circle cx="3" cy="3" r="3" fill="currentColor" />
              </svg>
            </RadixRadioGroup.Indicator>
          </Box>
        </Box>
        <Text size={5}>{title}</Text>
        <Box />
        <Text size={1} color="default2">
          {description}
        </Text>
      </Box>
    </RadixRadioGroup.Item>
  );
};
