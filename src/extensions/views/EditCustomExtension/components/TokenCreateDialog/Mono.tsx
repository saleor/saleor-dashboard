import { MONO_FONT_FAMILY } from "@dashboard/styles/monoFontFamily";
import { Text } from "@saleor/macaw-ui-next";
import { type PropsWithChildren } from "react";

export const Mono = ({ children }: PropsWithChildren<{}>) => (
  <Text
    style={{
      fontFamily: MONO_FONT_FAMILY,
    }}
    fontSize={2}
    display="block"
  >
    {children}
  </Text>
);
