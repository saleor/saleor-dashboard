import { Box, Divider } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { FilterContext } from "./context";
import { Filters } from "./Filters";
import { NoValue } from "./NoValue";
import type { Error, FilterEvent, LeftOperatorOption, Row } from "./types";
import { useEventEmitter } from "./useEvents";

export type ConditionalFiltersLayout = "popover" | "inline" | "panel";

export interface ExperimentalFiltersProps {
  value: Array<Row | string>;
  leftOptions: LeftOperatorOption[];
  children?: ReactNode;
  onChange?: (event: FilterEvent["detail"]) => void;
  locale?: Record<string, string>;
  error?: Error[];
  layout?: ConditionalFiltersLayout;
}

export const Root = ({
  value,
  onChange,
  leftOptions,
  children,
  layout = "popover",
  locale = {
    WHERE: "Where",
    AND: "and",
    OR: "or",
    noValueText: "Click button below to start filtering",
  },
  error,
}: ExperimentalFiltersProps) => {
  const { emitter } = useEventEmitter({
    onChange,
  });
  const rows =
    value.length > 0 ? (
      <Filters
        value={value}
        leftOptions={leftOptions}
        emitter={emitter}
        locale={locale}
        error={error}
        layout={layout}
      />
    ) : null;

  return (
    <FilterContext.Provider value={{ emitter, actionButtonsDisabled: value.length === 0 }}>
      {layout === "panel" ? (
        <Box display="flex" flexDirection="column" width="100%" __minWidth="0">
          {rows ? <Box padding={4}>{rows}</Box> : null}
          {children}
        </Box>
      ) : layout === "inline" ? (
        <Box display="flex" flexDirection="column" gap={3} width="100%" __minWidth="0">
          {rows ? (
            <>
              {rows}
              <Divider />
            </>
          ) : null}
          {children}
        </Box>
      ) : (
        <Box height="100%" width="100%" display="grid" __gridTemplateRows="1fr" __minWidth="0">
          {rows ?? <NoValue locale={locale} />}
          <Divider />
          {children}
        </Box>
      )}
    </FilterContext.Provider>
  );
};
