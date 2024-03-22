import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const RadioTileIndicator = () => {
  return (
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
      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" fill="white">
        <circle cx="3" cy="3" r="3" fill="currentColor" />
      </svg>
    </RadixRadioGroup.Indicator>
  );
};
