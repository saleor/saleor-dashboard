// @ts-strict-ignore
import { getStatusColor } from "@dashboard/misc";
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
      "& > span": {
        fontWeight: 500,
      },
    },
  },
  { name: "Pill" },
);

// Main purpose of this component is to override default Pill component
// from macaw-ui to add custom styles
// TODO: migrate to Pill component from new macaw-ui when it will be ready
export const Pill = forwardRef<HTMLDivElement, PillProps>(({ color: status, ...props }, ref) => {
  const { theme: currentTheme } = useTheme();

  const colors = getStatusColor({
    status: status === "generic" ? "neutral" : (status as any),
    currentTheme,
  });
  const classes = useStyles();

  return (
    <MacawuiPill
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      {...props}
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
});

Pill.displayName = "Pill";
