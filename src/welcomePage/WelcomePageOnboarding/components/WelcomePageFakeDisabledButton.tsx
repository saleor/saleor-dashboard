import { Button, ButtonProps, vars } from "@saleor/macaw-ui-next";
import { forwardRef, useState } from "react";

export const WelcomePageFakeDisabledButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Button
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cursor="not-allowed"
        variant="primary"
        boxShadow="none"
        aria-disabled
        tabIndex={-1}
        // I cannot override the background color of the button due to that existing styles were applied as last
        style={{
          backgroundColor: isHovered
            ? vars.colors.background.buttonDefaultPrimaryHovered
            : vars.colors.background.buttonDefaultDisabled,
          color: vars.colors.text.defaultDisabled,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

WelcomePageFakeDisabledButton.displayName = "WelcomePageFakeDisabledButton";
