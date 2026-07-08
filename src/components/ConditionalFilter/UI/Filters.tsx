import { Box, Text } from "@saleor/macaw-ui-next";

import { type ExperimentalFiltersProps } from ".";
import { createErrorLookup, getErrorByRowIndex } from "./errors";
import { type FilterEventEmitter } from "./EventEmitter";
import { RowComponent } from "./Row";

type FiltersProps = Pick<ExperimentalFiltersProps, "value" | "leftOptions" | "error" | "layout"> & {
  emitter: FilterEventEmitter;
  locale: Record<string, string>;
};

export const Filters = ({
  value,
  leftOptions,
  emitter,
  locale,
  error,
  layout = "popover",
}: FiltersProps) => {
  const errorsByRowIndex = createErrorLookup(error);
  const isInline = layout === "inline";

  return (
    <Box
      display="grid"
      __gridTemplateColumns={isInline ? "auto minmax(0, 1fr)" : "repeat(2, auto)"}
      alignItems="center"
      columnGap={isInline ? 3 : 2}
      rowGap={isInline ? 3 : 3}
      alignSelf="start"
      width={isInline ? "100%" : undefined}
      __minWidth={isInline ? "0" : undefined}
    >
      <Text paddingTop={1.5}>{locale.WHERE}</Text>
      {value.map((item, idx) =>
        typeof item === "string" ? (
          <Text key={idx} paddingTop={1.5}>
            {locale[item]}
          </Text>
        ) : (
          <RowComponent
            item={item}
            index={idx}
            key={`filterRow-${idx}`}
            leftOptions={leftOptions}
            emitter={emitter}
            error={getErrorByRowIndex(errorsByRowIndex, idx)}
            layout={layout}
          />
        ),
      )}
    </Box>
  );
};
