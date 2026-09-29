// @ts-strict-ignore
import { inputTypeMessages } from "@dashboard/attributes/components/AttributeDetails/messages";
import { AttributeInputTypeTooltip } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeTooltip";
import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import { SwatchRow } from "@dashboard/components/Attributes/SwatchRow";
import {
  getAttributeRowLabelProps,
  getErrorMessage,
  getFileChoice,
  getMultiChoices,
  getMultiDisplayValue,
  getReferenceDisplayValue,
  getTruncatedTextValue,
} from "@dashboard/components/Attributes/utils";
import { CountPill, countPillFromNumber } from "@dashboard/components/CountPill/CountPill";
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import FileUploadField from "@dashboard/components/FileUploadField/FileUploadField";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorClamp } from "@dashboard/components/RichTextEditor/RichTextEditorClamp";
import { Title2 } from "@dashboard/components/Title2/Title2";
import { AttributeEntityTypeEnum, AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

import { Multiselect } from "../Combobox/components/Multiselect";
import { DateTimeField } from "../DateTimeField/DateTimeField";
import { AttributeBooleanControl } from "./AttributeBooleanControl";
import { AttributeReferenceEntityIcon } from "./AttributeReferenceEntityIcon";
import styles from "./AttributeRow.module.css";
import { useAttributeRowChrome } from "./attributeRowChrome";
import { DropdownRow } from "./DropdownRow";
import { ReferenceList } from "./ReferenceList";
import { ReferenceMark, ReferenceTitle, showsThumbnail } from "./referenceValueAppearance";
import { SingleReferenceField } from "./SingleReferenceField";
import { type AttributeRowProps } from "./types";
import { mergeReferenceDetails, useProductReferenceDetails } from "./useProductReferenceDetails";

const messages = defineMessages({
  noReferences: {
    id: "lLyfGK",
    defaultMessage: "None",
    description: "reference attribute row header, no values assigned yet",
  },
  addReferences: {
    id: "Rb0T6v",
    defaultMessage: "Add references",
    description: "accessible label of the add button in a reference attribute row header",
  },
  moreReferences: {
    id: "OPj7DU",
    defaultMessage: "+{count} more",
    description: "collapsed reference attribute row, values not shown in the peek",
  },
});

/** Names shown on one line while a reference attribute row is collapsed. */
const REFERENCE_PEEK_COUNT = 3;

const AttributeRow = ({
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
  referenceTypeId,
  referenceGroupExpanded = false,
  onReferenceGroupExpandedChange,
  referenceListView,
  onReferenceListViewChange,
}: AttributeRowProps): React.ReactNode => {
  const intl = useIntl();
  const rowChrome = useAttributeRowChrome();
  const labelProps = getAttributeRowLabelProps(attribute);
  const rememberGroup =
    referenceTypeId !== undefined && onReferenceGroupExpandedChange !== undefined;
  const groupExpanded = rememberGroup ? referenceGroupExpanded : undefined;
  const isThumbReferenceList =
    attribute.data.inputType === AttributeInputTypeEnum.REFERENCE &&
    showsThumbnail(attribute.data.entityType);
  const referenceDetails = useProductReferenceDetails({
    ids: attribute.value ?? [],
    entityType: attribute.data.entityType,
    skip: !isThumbReferenceList,
  });

  switch (attribute.data.inputType) {
    case AttributeInputTypeEnum.SINGLE_REFERENCE:
      return (
        <SingleReferenceField
          attribute={attribute}
          disabled={disabled}
          loading={loading}
          error={error}
          onReferencesAddClick={onReferencesAddClick}
          onReferencesRemove={onReferencesRemove}
        />
      );
    case AttributeInputTypeEnum.REFERENCE: {
      const referenceValues = mergeReferenceDetails(
        getReferenceDisplayValue(attribute),
        referenceDetails,
      );
      const isCardRow = rowChrome === "card";
      const removeReferences = (ids: string[]) =>
        onReferencesRemove(
          attribute.id,
          (attribute.value ?? []).filter(id => !ids.includes(id)),
        );
      const errorMessage = error ? (
        <Box paddingX={6} paddingY={2}>
          <Text size={2} color="critical1" data-test-id="attribute-reference-error">
            {getErrorMessage(error, intl)}
          </Text>
        </Box>
      ) : null;
      const referenceList = (
        <ReferenceList
          entityType={attribute.data.entityType}
          values={referenceValues}
          savedIds={attribute.data.savedReferenceIds}
          view={onReferenceListViewChange ? referenceListView : undefined}
          onViewChange={onReferenceListViewChange}
          details={isThumbReferenceList ? Array.from(referenceDetails.values()) : undefined}
          disabled={disabled || loading}
          onRemove={removeReferences}
          onRemoveAll={() => onReferencesRemove(attribute.id, [])}
          onReorder={event => onReferencesReorder(attribute.id, event)}
        />
      );
      const addButton = (
        <Button
          variant="secondary"
          size="small"
          disabled={disabled || loading}
          onClick={() => onReferencesAddClick(attribute)}
          aria-label={intl.formatMessage(messages.addReferences)}
          data-test-id="attribute-reference-add"
          icon={<Plus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
        />
      );
      const label = typeof attribute.label === "string" ? attribute.label : String(attribute.label);
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      const inputTypeIcon = (
        <AttributeInputTypeTooltip
          inputType={attribute.data.inputType}
          size="xsmall"
          unit={attribute.data.unit}
        />
      );

      if (isCardRow) {
        const count = referenceValues.length;

        return (
          <Box as="li" className={styles.referenceGroupItem} data-attribute-row="group">
            <DetailGroupBox
              groupId={attribute.id}
              variant="flush"
              dataTestId="attribute-reference-group"
              triggerButtonTestId="attribute-reference-group-expand"
              expanded={groupExpanded}
              onExpandedChange={rememberGroup ? onReferenceGroupExpandedChange : undefined}
              headerStart={
                <Text fontWeight="medium" color="default1" className={styles.groupLabelText}>
                  {capitalizedLabel}
                </Text>
              }
              headerMeta={
                <Box display="flex" alignItems="center" gap={1}>
                  {inputTypeIcon}
                  <AttributeReferenceEntityIcon entityType={attribute.data.entityType} />
                </Box>
              }
              headerBody={
                count > 0 ? (
                  <Box className={styles.peek} data-test-id="attribute-reference-peek">
                    {referenceValues.slice(0, REFERENCE_PEEK_COUNT).map(value => (
                      <span
                        key={value.value}
                        className={clsx(
                          styles.peekChip,
                          attribute.data.entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT &&
                            styles.peekChipVariant,
                          !showsThumbnail(attribute.data.entityType) && styles.peekChipNameOnly,
                        )}
                      >
                        {showsThumbnail(attribute.data.entityType) ? (
                          <span data-test-id="attribute-reference-peek-thumb">
                            <ReferenceMark
                              name={
                                attribute.data.entityType ===
                                AttributeEntityTypeEnum.PRODUCT_VARIANT
                                  ? (value.caption ?? value.label)
                                  : value.label
                              }
                              thumbnailUrl={value.thumbnailUrl}
                              compact
                            />
                          </span>
                        ) : null}
                        <ReferenceTitle
                          value={{ ...value, url: undefined }}
                          entityType={attribute.data.entityType}
                          lineClassName={styles.peekTitle}
                          nameClassName={styles.peekItem}
                          secondaryClassName={styles.peekItemSecondary}
                        />
                      </span>
                    ))}
                    {count > REFERENCE_PEEK_COUNT ? (
                      <span className={styles.peekMore} data-test-id="attribute-reference-more">
                        {intl.formatMessage(messages.moreReferences, {
                          count: count - REFERENCE_PEEK_COUNT,
                        })}
                      </span>
                    ) : null}
                  </Box>
                ) : (
                  <span />
                )
              }
              headerEnd={
                <>
                  <Box data-test-id="attribute-reference-count">
                    {count > 0 ? (
                      <CountPill count={countPillFromNumber(count)} active />
                    ) : (
                      <Text size={2} color="default2" whiteSpace="nowrap">
                        {intl.formatMessage(messages.noReferences)}
                      </Text>
                    )}
                  </Box>
                  {addButton}
                </>
              }
            >
              {referenceList}
            </DetailGroupBox>
            {errorMessage}
          </Box>
        );
      }

      if (referenceValues.length === 0) {
        return (
          <BasicAttributeRow label={attribute.label} {...labelProps}>
            <Box display="flex" justifyContent="flex-end">
              {addButton}
            </Box>
            {error ? (
              <Text size={2} color="critical1" data-test-id="attribute-reference-error">
                {getErrorMessage(error, intl)}
              </Text>
            ) : null}
          </BasicAttributeRow>
        );
      }

      return (
        <Box as="li" className={styles.referenceGroupItem}>
          <DetailGroupBox
            groupId={attribute.id}
            variant="secondary"
            dataTestId="attribute-reference-group"
            triggerButtonTestId="attribute-reference-group-expand"
            expanded={groupExpanded}
            onExpandedChange={rememberGroup ? onReferenceGroupExpandedChange : undefined}
            marginTop={2}
            headerStart={
              <Box display="flex" alignItems="center" gap={1}>
                <Title2>{capitalizedLabel}</Title2>
                {inputTypeIcon}
                <AttributeReferenceEntityIcon entityType={attribute.data.entityType} />
              </Box>
            }
            headerEnd={
              <>
                <Text size={2} color="default2">
                  {referenceValues.length}
                </Text>
                {addButton}
              </>
            }
          >
            <Box padding={4}>{referenceList}</Box>
          </DetailGroupBox>
          {errorMessage}
        </Box>
      );
    }
    case AttributeInputTypeEnum.FILE:
      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
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
        <DropdownRow
          attribute={attribute}
          attributeValues={attributeValues}
          disabled={disabled}
          error={error}
          onChange={onChange}
          fetchAttributeValues={fetchAttributeValues}
          fetchMoreAttributeValues={fetchMoreAttributeValues}
          onAttributeSelectBlur={onAttributeSelectBlur}
        />
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
    case AttributeInputTypeEnum.PLAIN_TEXT: {
      // Since the API doesn't enforce a limit for plain text attribute length, we need to set one here. If we don't, the dashboard will freeze when the user tries to display a product with a long attribute value.
      const MAX_LENGTH = 10000; // This is an arbitrary number. Dashboard will still work with a higher number, but it gets significantly slower.
      const attributeValue = attribute.value[0];
      const isTooLong = attributeValue?.length > MAX_LENGTH;

      const value = isTooLong ? getTruncatedTextValue(attributeValue, MAX_LENGTH) : attributeValue;

      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          <Input
            disabled={isTooLong || disabled}
            error={!!error}
            label=""
            name={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            type="text"
            value={value}
            size="small"
            id={`attribute:${attribute.label}`}
            helperText={
              isTooLong
                ? intl.formatMessage(inputTypeMessages.plainTextTruncated, {
                    length: MAX_LENGTH,
                  })
                : getErrorMessage(error, intl)
            }
          />
        </BasicAttributeRow>
      );
    }
    case AttributeInputTypeEnum.RICH_TEXT: {
      const { getShouldMount, getDefaultValue, getMountEditor, getHandleChange } = richTextGetters;
      const defaultValue = getDefaultValue(attribute.id);

      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          {getShouldMount(attribute.id) && (
            <Box __minWidth={210}>
              <RichTextEditorClamp active={rowChrome === "card"}>
                <RichTextEditor
                  defaultValue={defaultValue}
                  editorRef={getMountEditor(attribute.id)}
                  onChange={getHandleChange(attribute.id)}
                  name={`attribute:${attribute.label}`}
                  disabled={disabled}
                  error={!!error}
                  label=""
                  helperText={getErrorMessage(error, intl)}
                  id={`attribute:${attribute.label}`}
                />
              </RichTextEditorClamp>
            </Box>
          )}
        </BasicAttributeRow>
      );
    }
    case AttributeInputTypeEnum.NUMERIC:
      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          <Input
            disabled={disabled}
            error={!!error}
            label=""
            name={`attribute:${attribute.label}`}
            id={`attribute:${attribute.label}`}
            onChange={event => onChange(attribute.id, event.target.value)}
            inputMode="decimal"
            type="text"
            value={attribute.value[0]}
            size="small"
            helperText={getErrorMessage(error, intl)}
          />
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.BOOLEAN:
      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          <AttributeBooleanControl
            name={`attribute:${attribute.id}`}
            label={String(attribute.label)}
            value={typeof attribute.value[0] === "boolean" ? attribute.value[0] : null}
            required={attribute.data.isRequired}
            invalid={
              !!error || (attribute.data.isRequired && typeof attribute.value[0] !== "boolean")
            }
            disabled={disabled}
            onChange={value => onChange(attribute.id, value)}
          />
          {error ? (
            <Text size={2} color="critical1">
              {getErrorMessage(error, intl)}
            </Text>
          ) : null}
        </BasicAttributeRow>
      );
    case AttributeInputTypeEnum.DATE:
      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          <Input
            width="100%"
            disabled={disabled}
            error={!!error}
            helperText={getErrorMessage(error, intl)}
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
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          <DateTimeField
            name={`attribute:${attribute.label}`}
            disabled={disabled}
            error={error}
            value={attribute.value[0]}
            onChange={value => onChange(attribute.id, value)}
          />
        </BasicAttributeRow>
      );
    default:
      return (
        <BasicAttributeRow label={attribute.label} {...labelProps}>
          {/* TODO It works, but replace it with Macaw Multiselect */}
          <Box className={styles.valueControl}>
            <Multiselect
              width="100%"
              allowCustomValues
              alwaysFetchOnFocus
              disabled={disabled}
              name={`attribute:${attribute.label}`}
              label=""
              error={!!error}
              helperText={getErrorMessage(error, intl)}
              options={getMultiChoices(attributeValues)}
              value={getMultiDisplayValue(attribute, attributeValues)}
              fetchOptions={query => {
                fetchAttributeValues(query, attribute.id);
              }}
              onChange={e => {
                onMultiChange(
                  attribute.id,
                  e.target.value.map(({ value }) => value),
                );
              }}
              fetchMore={fetchMoreAttributeValues}
              onBlur={onAttributeSelectBlur}
            />
          </Box>
        </BasicAttributeRow>
      );
  }
};

AttributeRow.displayName = "AttributeRow";
export default AttributeRow;
