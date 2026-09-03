import { Box, Text } from "@saleor/macaw-ui-next";

import { createErrorLookup, getErrorByRowIndex } from "./errors";
import { type FilterEventEmitter } from "./EventEmitter";
import { isFlatFilterLayout } from "./filterLayout";
import { type ExperimentalFiltersProps } from "./Root";
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
}: FiltersProps): React.ReactNode => {
  const errorsByRowIndex = createErrorLookup(error);
  const isInline = isFlatFilterLayout(layout);
  const columnGap = isInline ? 3 : 2;

  return (
    <Box
      display="grid"
      __gridTemplateColumns="auto minmax(0, 1fr)"
      alignItems="start"
      columnGap={columnGap}
      rowGap={3}
      alignSelf="start"
      width="100%"
      __minWidth="0"
    >
      <Text color="default2" paddingTop={1.5}>
        {locale.WHERE}
      </Text>
      {value.map((item, idx) =>
        typeof item === "string" ? (
          <Text key={idx} color="default2" paddingTop={1.5}>
            {locale[item]}
          </Text>
        ) : (
          <RowComponent
            item={item}
            index={idx}
            rows={value}
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
