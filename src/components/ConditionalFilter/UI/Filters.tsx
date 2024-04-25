import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

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

  return (
    <Box
      display="grid"
      __gridTemplateColumns="repeat(2, auto)"
      alignItems="start"
      columnGap={2}
      rowGap={3}
      alignSelf="start"
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
          />
        ),
      )}
    </Box>
  );
};
