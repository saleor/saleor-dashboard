// @ts-strict-ignore
import { getStatusColor, PillStatusType } from "@dashboard/misc";
import { makeStyles, Pill as MacawuiPill, PillProps } from "@saleor/macaw-ui";
import { useTheme } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { forwardRef } from "react";

const useStyles = makeStyles(
  {
    pill: {
      borderRadius: "32px",
      border: "1px solid",
      fontWeight: 500,
      paddingLeft: "2px",
      paddingRight: "2px",
      paddingTop: "0",
      paddingBottom: "0",
      "& > span": {
        fontWeight: 500,
      },
      // Override MacawUI Pill padding when there is an icon
      "& > div, & > svg": {
        marginLeft: "8px", // Compemsate for the icon internal padding if needed, or adjust based on real DOM
      },
    },
  },
  { name: "Pill" },
);

export interface CustomPillProps extends Omit<PillProps, "color"> {
  color: PillStatusType;
}

// Main purpose of this component is to override default Pill component
// from macaw-ui to add custom styles
// TODO: migrate to Pill component from new macaw-ui when it will be ready
export const Pill = forwardRef<HTMLDivElement, CustomPillProps>(
  ({ color: status, ...props }, ref) => {
    const { theme: currentTheme } = useTheme();

    const colors = getStatusColor({
      status: status,
      currentTheme,
    });
    const classes = useStyles();

    return (
      <MacawuiPill
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        {...(props as any)}
        ref={ref}
        className={clsx(classes.pill, props.className)}
        style={{
          backgroundColor: colors.base,
          borderColor: colors.border,
          color: colors.text,
          fontWeight: 500,
          ...props.style,
        }}
      />
    );
  },
);

Pill.displayName = "Pill";
