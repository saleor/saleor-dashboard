// @ts-strict-ignore
import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import ExtendedAttributeRow from "@dashboard/components/Attributes/ExtendedAttributeRow";
import { attributeRowMessages } from "@dashboard/components/Attributes/messages";
import { SwatchRow } from "@dashboard/components/Attributes/SwatchRow";
import {
  getErrorMessage,
  getFileChoice,
  getMultiChoices,
  getMultiDisplayValue,
  getReferenceDisplayValue,
  getSingleChoices,
  getSingleDisplayValue,
} from "@dashboard/components/Attributes/utils";
import FileUploadField from "@dashboard/components/FileUploadField";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import SortableChipsField from "@dashboard/components/SortableChipsField";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import {
  Box,
  Checkbox,
  DynamicCombobox,
  DynamicMultiselect,
  Input,
  Text,
} from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React from "react";
import { useIntl } from "react-intl";

import { DateTimeField } from "../DateTimeField";
import { AttributeRowProps } from "./types";

const AttributeRow: React.FC<AttributeRowProps> = ({
  attribute,
  attributeValues,
  disabled,
  error,
  loading,
  onFileChange,
  onMultiChange,
  onReferencesAddClick,
  onReferencesRemove,
  onReferencesReorder,
  onChange,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  onAttributeSelectBlur,
  richTextGetters,
}) => {
  const intl = useIntl();

  const debouncedFetchAttributeValues = debounce((inputValue: string) => {
    if (!inputValue) {
      onChange(attribute.id, null);
      fetchAttributeValues("", attribute.id);
      return;
    }

    fetchAttributeValues(inputValue, attribute.id);
  }, 600);

  switch (attribute.data.inputType) {
    case AttributeInputTypeEnum.REFERENCE:
      return (
        <ExtendedAttributeRow
          label={attribute.label}
          selectLabel={intl.formatMessage(attributeRowMessages.reference)}
          onSelect={() => onReferencesAddClick(attribute)}
          disabled={disabled}
        >
          <SortableChipsField
            values={getReferenceDisplayValue(attribute)}
            onValueDelete={value =>
              onReferencesRemove(
                attribute.id,
                attribute.value?.filter(id => id !== value),
              )
            }
            onValueReorder={event => onReferencesReorder(attribute.id, event)}
            loading={loading}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
          />
        </ExtendedAttributeRow>
      );
    case AttributeInputTypeEnum.FILE:
      return (
        <BasicAttributeRow label={attribute.label}>
          <FileUploadField
            disabled={disabled}
            loading={loading}
            file={getFileChoice(attribute)}
            onFileUpload={file => onFileChange(attribute.id, file)}
            onFileDelete={() => onFileChange(attribute.id, undefined)}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            inputProps={{
              name: `attribute:${attribute.label}`,
            }}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.DROPDOWN:
      return (
        <BasicAttributeRow
          label={attribute.label}
          id={`attribute:${attribute.label}`}
        >
          <DynamicCombobox
            disabled={disabled}
            options={getSingleChoices(attributeValues)}
            value={
              attribute.value[0]
                ? {
                    label: getSingleDisplayValue(attribute, attributeValues),
                    value: attribute.value[0],
                  }
                : null
            }
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            name={`attribute:${attribute.label}`}
            id={`attribute:${attribute.label}`}
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
            onChange={value => onChange(attribute.id, value.value)}
            onInputValueChange={debouncedFetchAttributeValues}
            onFocus={() => {
              fetchAttributeValues("", attribute.id);
            }}
            onBlur={onAttributeSelectBlur}
            loading={fetchMoreAttributeValues.loading}
            locale={{
              loadingText: "Loading...",
            }}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.SWATCH:
      return (
        <SwatchRow
          attribute={attribute}
          attributeValues={attributeValues}
          onChange={onChange}
          disabled={disabled}
          error={error}
          fetchAttributeValues={fetchAttributeValues}
          fetchMoreAttributeValues={fetchMoreAttributeValues}
        />
      );
    case AttributeInputTypeEnum.PLAIN_TEXT:
      return (
        <BasicAttributeRow
          label={attribute.label}
          description={intl.formatMessage(inputTypeMessages.plainText)}
          id={`attribute:${attribute.label}`}
        >
          <Input
            disabled={disabled}
            error={!!error}
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
            name={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="text"
            value={attribute.value[0]}
            size="small"
            id={`attribute:${attribute.label}`}
            helperText={getErrorMessage(error, intl)}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.RICH_TEXT:
      const {
        getShouldMount,
        getDefaultValue,
        getMountEditor,
        getHandleChange,
      } = richTextGetters;
      const defaultValue = getDefaultValue(attribute.id);
      return (
        <BasicAttributeRow
          label={attribute.label}
          description={intl.formatMessage(inputTypeMessages.richText)}
          id={`attribute:${attribute.label}`}
        >
          {getShouldMount(attribute.id) && (
            <Box __minWidth={210}>
              <RichTextEditor
                defaultValue={defaultValue}
                editorRef={getMountEditor(attribute.id)}
                onChange={getHandleChange(attribute.id)}
                name={`attribute:${attribute.label}`}
                disabled={disabled}
                error={!!error}
                label={intl.formatMessage(attributeRowMessages.valueLabel)}
                helperText={getErrorMessage(error, intl)}
                id={`attribute:${attribute.label}`}
              />
            </Box>
          )}
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.NUMERIC:
      return (
        <BasicAttributeRow
          label={attribute.label}
          id={`attribute:${attribute.label}`}
        >
          <Input
            disabled={disabled}
            error={!!error}
            label={intl.formatMessage(attributeRowMessages.valueLabel)}
            name={`attribute:${attribute.label}`}
            id={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="number"
            value={attribute.value[0]}
            size="small"
            helperText={getErrorMessage(error, intl)}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.BOOLEAN:
      return (
        <Box as="li" display="flex" gap={2} alignItems="center" padding={1}>
          <Box data-test-id="attribute-value">
            <Box
              display="flex"
              gap={0.5}
              flexDirection="column"
              alignItems="flex-end"
            >
              <Checkbox
                name={`attribute:${attribute.label}`}
                onCheckedChange={checked => onChange(attribute.id, checked)}
                checked={JSON.parse(attribute.value[0] ?? "false")}
                error={!!error}
                id={`attribute:${attribute.label}`}
              />
              <Text variant="caption" color="textCriticalDefault">
                {getErrorMessage(error, intl)}
              </Text>
            </Box>
          </Box>
          <Box
            data-test-id="attribute-label"
            as="label"
            htmlFor={`attribute:${attribute.label}`}
            display="flex"
            gap={1}
            cursor="pointer"
          >
            <Text>{attribute.label}</Text>
          </Box>
        </Box>
      );
    case AttributeInputTypeEnum.DATE:
      return (
        <BasicAttributeRow
          label={attribute.label}
          id={`attribute:${attribute.label}`}
        >
          <Input
            width="100%"
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            label={intl.formatMessage(commonMessages.date)}
            name={`attribute:${attribute.label}`}
            id={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="date"
            value={attribute.value[0]}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.DATE_TIME:
      return (
        <BasicAttributeRow label={attribute.label}>
          <DateTimeField
            fullWidth
            name={`attribute:${attribute.label}`}
            disabled={disabled}
            error={error}
            value={attribute.value[0]}
            helperText={getErrorMessage(error, intl)}
            onChange={value => onChange(attribute.id, value)}
          />
        </BasicAttributeRow>
      );
    default:
      return (
        <BasicAttributeRow label={attribute.label}>
          <DynamicMultiselect
            label={intl.formatMessage(attributeRowMessages.multipleValueLabel)}
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
            name={`attribute:${attribute.label}`}
            value={getMultiDisplayValue(attribute, attributeValues)}
            options={getMultiChoices(attributeValues)}
            onChange={value => {
              onMultiChange(
                attribute.id,
                value.map(({ value }) => value),
              );
            }}
            onFocus={() => fetchAttributeValues("", attribute.id)}
            onInputValueChange={value =>
              fetchAttributeValues(value, attribute.id)
            }
            onBlur={onAttributeSelectBlur}
          />
        </BasicAttributeRow>
      );
  }
};
AttributeRow.displayName = "AttributeRow";
export default AttributeRow;
