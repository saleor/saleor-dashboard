import { Box } from "@saleor/macaw-ui-next";

import { ExperimentalFiltersProps } from ".";
import { createErrorLookup, getErrorByRowIndex } from "./errors";
import { FilterEventEmitter } from "./EventEmitter";
import { RowComponent } from "./Row";

type FiltersProps = Pick<ExperimentalFiltersProps, "value" | "leftOptions" | "error"> & {
  emitter: FilterEventEmitter;
  locale: Record<string, string>;
};

export const Filters = ({ value, leftOptions, emitter, locale, error }: FiltersProps) => {
  const errorsByRowIndex = createErrorLookup(error);
  const defaultConnectorLabel = locale.AND ?? locale.WHERE ?? "";
  let pendingLabel = locale.WHERE ?? "";

  return (
    <Box display="flex" flexDirection="column" gap={3} alignSelf="start">
      {value.map((item, originalIdx) => {
        // Show `WHERE` only for first row, then `AND`
        if (typeof item === "string") {
          pendingLabel = locale[item] ?? defaultConnectorLabel;

          return null;
        }

        const label = pendingLabel;

        pendingLabel = defaultConnectorLabel;

        return (
          <RowComponent
            item={item}
            index={originalIdx}
            key={`filterRow-${originalIdx}`}
            leftOptions={leftOptions}
            emitter={emitter}
            error={getErrorByRowIndex(errorsByRowIndex, originalIdx)}
            label={label}
          />
        );
      })}
    </Box>
  );
};
