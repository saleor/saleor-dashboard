import { Box, Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { metadataInputMessages } from "../intl";
import { FilterEventEmitter } from "./EventEmitter";
import { DoubleTextOperator } from "./types";

interface MetadataInputProps {
  index: number;
  selected: DoubleTextOperator;
  emitter: FilterEventEmitter;
  error: boolean;
  disabled: boolean;
}

export const MetadataInput = ({
  index,
  selected,
  emitter,
  error,
  disabled,
}: MetadataInputProps) => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      className="conditional-metadata"
      borderWidth={1}
      borderStyle="solid"
      borderColor={{
        default: "default1",
        focusWithin: "accent1",
      }}
      borderRadius={3}
    >
      <Input
        data-test-id={`right-${index}-1`}
        value={selected.value[0] || ""}
        onChange={e => {
          emitter.changeRightOperator(index, [e.target.value, selected.value[1]]);
        }}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        placeholder={intl.formatMessage(metadataInputMessages.keyPlaceholder)}
        disabled={disabled}
      />
      <Box __width="1px" backgroundColor="default1Focused" />
      <Input
        data-test-id={`right-${index}-2`}
        value={selected.value[1] || ""}
        onChange={e => {
          emitter.changeRightOperator(index, [selected.value[0], e.target.value]);
        }}
        onFocus={() => {
          emitter.focusRightOperator(index);
        }}
        onBlur={() => {
          emitter.blurRightOperator(index);
        }}
        error={error}
        placeholder={intl.formatMessage(metadataInputMessages.valuePlaceholder)}
        disabled={disabled}
      />
    </Box>
  );
};
