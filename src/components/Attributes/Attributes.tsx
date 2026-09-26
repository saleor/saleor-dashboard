import { type AttributeReference } from "@dashboard/attributes/utils/data";
import {
  type AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  type AttributeValueDetailsFragment,
  type AttributeValueFragment,
  type MeasurementUnitsEnum,
} from "@dashboard/graphql";
import { type FormsetAtomicData } from "@dashboard/hooks/useFormset";
import { useStableCallback } from "@dashboard/hooks/useStableCallback";
import { type AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { type FetchMoreProps } from "@dashboard/types";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import { Box, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { DetailSettingsCard } from "../DetailSettingsCard/DetailSettingsCard";
import { AttributeListItem } from "./AttributeListItem";
import { type AttributeReferenceView } from "./attributeReferenceLayout";
import { AttributeRowChromeContext } from "./attributeRowChrome";
import styles from "./Attributes.module.css";
import {
  type AttributeFieldError,
  type AttributeRowChrome,
  type AttributeRowHandlers,
  type VariantAttributeScope,
} from "./types";
import { resolveByAttributeId, resolveFetchMoreByAttributeId } from "./utils";

export interface AttributeInputData {
  inputType: AttributeInputTypeEnum;
  entityType?: AttributeEntityTypeEnum;
  unit?: MeasurementUnitsEnum | null;
  variantAttributeScope?: VariantAttributeScope;
  isRequired: boolean;
  values: AttributeValueDetailsFragment[];
  selectedValues?: AttributeValueDetailsFragment[];
  references?: AttributeReference[];
}
export type AttributeInput = FormsetAtomicData<
  AttributeInputData,
  string[],
  AttributeValuesMetadata[]
>;
export type AttributeValueChoices =
  | AttributeValueFragment[]
  | ((attributeId: string) => AttributeValueFragment[]);

export type AttributeValueFetchMore = FetchMoreProps | ((attributeId: string) => FetchMoreProps);

interface AttributesProps extends Omit<AttributeRowHandlers, "fetchMoreAttributeValues"> {
  attributes: AttributeInput[];
  attributeValues: AttributeValueChoices;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues: AttributeValueFetchMore;
  onAttributeSelectBlur: () => void;
  disabled: boolean;
  loading: boolean;
  errors: AttributeFieldError[];
  title?: React.ReactNode;
  richTextGetters: RichTextGetters<string>;
  /** Skip DashboardCard + accordion so entity-detail pages can wrap in DetailSettingsCard. */
  unwrapped?: boolean;
  /**
   * `card` renders the entity-detail `DetailSettingsCard` with full-bleed divided rows.
   * `legacy` keeps the `DashboardCard` chrome for pages not yet on the new detail language.
   */
  chrome?: AttributeRowChrome;
  /** Which screen remembers the flow/list choice for reference attributes. */
  referenceLayoutView: AttributeReferenceView;
}

const EMPTY_FETCH_MORE: FetchMoreProps = {
  hasMore: false,
  loading: false,
  onFetchMore: () => undefined,
};

const messages = defineMessages({
  attributesNumber: {
    id: "z0gGP+",
    defaultMessage: "{number} Attributes",
    description: "number of attributes",
  },
  header: {
    id: "3ukd9/",
    defaultMessage: "Attributes",
    description: "attributes, section header",
  },
  attributeCount: {
    id: "xziClW",
    defaultMessage: "{count, plural, one {# attribute} other {# attributes}}",
    description: "attributes card header, number of attributes",
  },
  referenceCount: {
    id: "gxBIiJ",
    defaultMessage: "{count, plural, one {# reference} other {# references}}",
    description: "attributes card header, total values assigned across reference attributes",
  },
});

const isReferenceAttribute = (attribute: AttributeInput): boolean =>
  attribute.data.inputType === AttributeInputTypeEnum.REFERENCE ||
  attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

const countReferences = (attributes: AttributeInput[]): number =>
  attributes
    .filter(isReferenceAttribute)
    .reduce((total, attribute) => total + (attribute.value?.length ?? 0), 0);

export const Attributes = ({
  attributes,
  attributeValues,
  errors,
  title,
  onAttributeSelectBlur,
  richTextGetters,
  unwrapped = false,
  chrome = "legacy",
  disabled,
  loading,
  onChange,
  onFileChange,
  onMultiChange,
  onReferencesAddClick,
  onReferencesRemove,
  onReferencesReorder,
  fetchAttributeValues,
  fetchMoreAttributeValues,
  referenceLayoutView,
}: AttributesProps) => {
  const intl = useIntl();
  const stableOnChange = useStableCallback(onChange);
  const stableOnFileChange = useStableCallback(onFileChange);
  const stableOnMultiChange = useStableCallback(onMultiChange);
  const stableOnReferencesAddClick = useStableCallback(onReferencesAddClick);
  const stableOnReferencesRemove = useStableCallback(onReferencesRemove);
  const stableOnReferencesReorder = useStableCallback(onReferencesReorder);
  const stableFetchAttributeValues = useStableCallback(fetchAttributeValues);
  const stableOnAttributeSelectBlur = useStableCallback(onAttributeSelectBlur);
  const isCard = chrome === "card";
  const list =
    attributes.length > 0 ? (
      <ul className={isCard ? styles.cardList : undefined}>
        {attributes.map(attribute => (
          <React.Fragment key={attribute.id}>
            <AttributeListItem
              disabled={disabled}
              loading={loading}
              onChange={stableOnChange}
              onFileChange={stableOnFileChange}
              onMultiChange={stableOnMultiChange}
              onReferencesAddClick={stableOnReferencesAddClick}
              onReferencesRemove={stableOnReferencesRemove}
              onReferencesReorder={stableOnReferencesReorder}
              fetchAttributeValues={stableFetchAttributeValues}
              referenceLayoutView={referenceLayoutView}
              attribute={attribute}
              errors={errors}
              attributeValues={resolveByAttributeId(attributeValues, attribute.id)}
              fetchMoreAttributeValues={
                resolveFetchMoreByAttributeId(fetchMoreAttributeValues, attribute.id) ??
                EMPTY_FETCH_MORE
              }
              onAttributeSelectBlur={stableOnAttributeSelectBlur}
              richTextGetters={richTextGetters}
            />
          </React.Fragment>
        ))}
      </ul>
    ) : null;

  if (unwrapped) {
    return (
      <AttributeRowChromeContext.Provider value={isCard ? "card" : "legacy"}>
        <Box data-test-id="attributes" display="flex" flexDirection="column" gap={1}>
          {list}
        </Box>
      </AttributeRowChromeContext.Provider>
    );
  }

  if (isCard) {
    const referenceCount = countReferences(attributes);
    const meta = [
      intl.formatMessage(messages.attributeCount, { count: attributes.length }),
      referenceCount > 0
        ? intl.formatMessage(messages.referenceCount, { count: referenceCount })
        : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <Box marginX={6} marginTop={4} marginBottom={4}>
        <DetailSettingsCard
          data-test-id="attributes"
          title={title || intl.formatMessage(messages.header)}
          headerEnd={
            <Text size={3} color="default2" data-test-id="attributes-card-meta">
              {meta}
            </Text>
          }
          contentFlush
          allowOverflow
        >
          <AttributeRowChromeContext.Provider value="card">
            {list}
          </AttributeRowChromeContext.Provider>
        </DetailSettingsCard>
      </Box>
    );
  }

  return (
    <DashboardCard paddingTop={6} data-test-id="attributes">
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Text size={6} fontWeight="medium">
              {title || intl.formatMessage(messages.header)}
            </Text>
            <Text size={2} color="default2">
              <FormattedMessage
                {...messages.attributesNumber}
                values={{
                  number: attributes.length,
                }}
              />
            </Text>
          </Box>
          {list}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
