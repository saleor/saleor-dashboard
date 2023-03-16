import { getStatusColor } from "@dashboard/misc";
import { makeStyles, Pill as MacawuiPill, PillProps } from "@saleor/macaw-ui";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles<{
  status: "error" | "warning" | "info" | "success";
  currentTheme: DefaultTheme;
}>(
  {
    pill: {
      borderRadius: "32px !important",
      border: "none !important",
      background: ({ currentTheme, status }) =>
        `${getStatusColor(status, currentTheme)} !important`,
    },
  },
  { name: "Pill" },
);

export const Pill = (props: PillProps) => {
  const { theme: currentTheme } = useTheme();
  const classes = useStyles({
    currentTheme,
    status: props.color as any,
  });

  return (
    <MacawuiPill {...props} className={clsx(classes.pill, props.className)} />
  );
};
