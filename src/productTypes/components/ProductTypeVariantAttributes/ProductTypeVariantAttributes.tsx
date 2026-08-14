// @ts-strict-ignore
import columnStyles from "@dashboard/attributes/components/AttributeListTableSkeleton/attributeListTableColumns.module.css";
import { AttributeListTableSkeletonRows } from "@dashboard/attributes/components/AttributeListTableSkeleton/AttributeListTableSkeleton";
import { AttributeValueRequiredCell } from "@dashboard/attributes/components/AttributeValueRequiredCell/AttributeValueRequiredCell";
import { messages as valueRequiredMessages } from "@dashboard/attributes/components/AttributeValueRequiredCell/messages";
import { attributeUrl } from "@dashboard/attributes/urls";
import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { ASSIGNABLE_LIST_TABLE_ACTION_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Link } from "@dashboard/components/Link";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { TableRowLinkCheckbox } from "@dashboard/components/TableRowLink/TableRowLinkCheckbox";
import { ProductAttributeType, type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { useOptimisticListReorder } from "@dashboard/hooks/useOptimisticListReorder";
import { buttonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableBody, TableCell } from "@material-ui/core";
import { Box, Button, Skeleton, Text, Toggle, Tooltip } from "@saleor/macaw-ui-next";
import capitalize from "lodash/capitalize";
import { Trash2 } from "lucide-react";
import { type KeyboardEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductTypeVariantAttributes.module.css";

interface ProductTypeVariantAttributesProps extends ListActions {
  assignedVariantAttributes: ProductTypeDetailsQuery["productType"]["assignedVariantAttributes"];
  disabled: boolean;
  hasVariants: boolean;
  type: string;
  testId?: string;
  selectedVariantAttributes: string[];
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeCreate: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  setSelectedVariantAttributes: (data: string[]) => void;
  loading?: boolean;
}

function handleContainerAssign(
  variantID: string,
  isSelected: boolean,
  selectedAttributes: string[],
  setSelectedAttributes: (data: string[]) => void,
) {
  if (isSelected) {
    setSelectedAttributes(
      selectedAttributes.filter(selectedContainer => selectedContainer !== variantID),
    );
  } else {
    setSelectedAttributes([...selectedAttributes, variantID]);
  }
}

const VariantSelectionSwitch = ({
  pressed,
  disabled,
  disabledReason,
  onPressedChange,
}: {
  pressed: boolean;
  disabled: boolean;
  disabledReason?: string;
  onPressedChange: (next: boolean) => void;
}): JSX.Element => {
  const toggle = (): void => {
    if (!disabled) {
      onPressedChange(!pressed);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  const switchControl = (
    <TableButtonWrapper>
      <Box
        className={styles.selectionSwitch}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={pressed}
        aria-disabled={disabled || undefined}
        data-test-id="variant-selection-checkbox"
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <Box className={styles.selectionSwitchToggle} aria-hidden>
          <Toggle
            pressed={pressed}
            onPressedChange={() => undefined}
            disabled={disabled}
            tabIndex={-1}
          />
        </Box>
        <Text size={2} color="default2" as="span" className={styles.selectionSwitchLabel}>
          <FormattedMessage
            {...(pressed ? messages.variantSelectionOn : messages.variantSelectionOff)}
          />
        </Text>
      </Box>
    </TableButtonWrapper>
  );

  if (!disabledReason) {
    return switchControl;
  }

  return (
    <Tooltip>
      <Tooltip.Trigger>{switchControl}</Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        {disabledReason}
      </Tooltip.Content>
    </Tooltip>
  );
};

const numberOfColumns = 6;
const ProductTypeVariantAttributes = (props: ProductTypeVariantAttributesProps) => {
  const {
    assignedVariantAttributes,
    disabled,
    hasVariants,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    type,
    testId,
    onAttributeAssign,
    onAttributeCreate,
    onAttributeReorder,
    onAttributeUnassign,
    onHasVariantsToggle,
    setSelectedVariantAttributes,
    selectedVariantAttributes,
    loading = false,
  } = props;
  const intl = useIntl();

  const attributeType = ProductAttributeType[type];
  const handleAssignAttribute = () => onAttributeAssign(attributeType);
  const handleCreateAttribute = () => onAttributeCreate(attributeType);
  const { items: orderedAssignedVariantAttributes, onSortEnd } = useOptimisticListReorder(
    assignedVariantAttributes,
    onAttributeReorder,
  );
  const isLoading = loading || assignedVariantAttributes === undefined;
  const showVariantTable = isLoading || hasVariants;
  const showVariantEmpty = hasVariants && !isLoading && !assignedVariantAttributes?.length;

  return (
    <AssignableListCard
      data-test-id="variant-attributes"
      title={intl.formatMessage(messages.title)}
      headerEnd={
        hasVariants || isLoading ? (
          <ButtonGroupWithDropdown
            variant="secondary"
            disabled={disabled || isLoading}
            onClick={handleAssignAttribute}
            testId={testId}
            options={[
              {
                label: intl.formatMessage({
                  id: "LApQsw",
                  defaultMessage: "Create attribute",
                  description: "create attribute from product type, button",
                }),
                testId: "create-variant-attribute",
                onSelect: handleCreateAttribute,
              },
            ]}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </ButtonGroupWithDropdown>
        ) : undefined
      }
    >
      {isLoading ? (
        <Box paddingX={6} paddingY={4} aria-busy="true">
          <Skeleton __height="3.5rem" />
        </Box>
      ) : (
        <DetailSettingToggleRow
          title={<FormattedMessage {...messages.usesVariantAttributes} />}
          description={<FormattedMessage {...messages.usesVariantAttributesDescription} />}
          pressed={hasVariants}
          disabled={disabled}
          testId="hasVariants"
          onPressedChange={onHasVariantsToggle}
        />
      )}
      {showVariantEmpty ? (
        <Box className={styles.empty}>
          <Text size={3} color="default2">
            <FormattedMessage {...messages.exclusivity} />
          </Text>
          <Placeholder>
            <FormattedMessage {...messages.empty} />
          </Placeholder>
        </Box>
      ) : showVariantTable ? (
        <>
          {!isLoading ? (
            <Box className={styles.hint}>
              <Text size={3} color="default2">
                <FormattedMessage {...messages.exclusivity} />
              </Text>
            </Box>
          ) : null}
          <ResponsiveTable bleed className={tableStyles.assignableTable}>
            <colgroup>
              <col className={tableStyles.dragCell} />
              <col className={tableStyles.checkboxCell} />
              <col />
              <col className={columnStyles.colValueRequired} />
              <col className={columnStyles.colVariant} />
              <col className={tableStyles.actionsCell} />
            </colgroup>
            <TableHead
              colSpan={numberOfColumns}
              compact
              disabled={disabled || isLoading}
              dragRows
              keepColumnHeaders
              selected={selected}
              items={
                isLoading
                  ? undefined
                  : orderedAssignedVariantAttributes.map(
                      selectedAttribute => selectedAttribute.attribute,
                    )
              }
              toggleAll={toggleAll}
            >
              <TableCell>
                {selected > 0 ? (
                  <Text data-test-id="SelectedText" size={2} lineHeight={2}>
                    <FormattedMessage
                      id="imYtnq"
                      defaultMessage="Selected {number, plural, one {# item} other {# items}}"
                      values={{ number: selected }}
                    />
                  </Text>
                ) : (
                  <Text size={2} lineHeight={2} color="default2">
                    <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
                  </Text>
                )}
              </TableCell>
              <TableCell className={columnStyles.colValueRequired}>
                <Text size={2} lineHeight={2} color="default2">
                  <FormattedMessage {...valueRequiredMessages.column} />
                </Text>
              </TableCell>
              <TableCell className={columnStyles.colVariant}>
                <Text size={2} lineHeight={2} color="default2">
                  <FormattedMessage
                    id="MnScte"
                    defaultMessage="Variant selection"
                    description="variant attribute checkbox"
                  />
                </Text>
              </TableCell>
              <TableCell className={tableStyles.actionsCell}>
                {selected > 0 && toolbar ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    width="100%"
                    height="100%"
                    paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
                  >
                    {toolbar}
                  </Box>
                ) : null}
              </TableCell>
            </TableHead>
            {isLoading ? (
              <TableBody data-test-id="variant-attributes-skeleton" aria-busy="true">
                <AttributeListTableSkeletonRows variantColumn="selection" />
              </TableBody>
            ) : (
              <SortableTableBody onSortEnd={onSortEnd}>
                {orderedAssignedVariantAttributes.map(
                  (assignedVariantAttribute, attributeIndex) => {
                    const { attribute } = assignedVariantAttribute;
                    const isVariantSelected = assignedVariantAttribute
                      ? isChecked(attribute.id)
                      : false;
                    const isSelected = !!selectedVariantAttributes.find(
                      selectedAttribute => selectedAttribute === attribute.id,
                    );
                    const variantSelectionDisabled = ![
                      "DROPDOWN",
                      "BOOLEAN",
                      "SWATCH",
                      "NUMERIC",
                    ].includes(attribute.inputType);
                    const readableAttributeInputType = capitalize(
                      attribute.inputType.split("_").join(" "),
                    );

                    return (
                      <SortableTableRow
                        selected={isVariantSelected}
                        className={tableStyles.row}
                        hover={!!attribute}
                        key={maybe(() => attribute.id)}
                        id={attribute.id}
                        index={attributeIndex || 0}
                        data-test-id={"id-" + +maybe(() => attribute.id)}
                      >
                        <TableCell className={tableStyles.checkboxCell}>
                          <TableRowLinkCheckbox
                            checked={isVariantSelected}
                            disabled={disabled}
                            onCheckedChange={() => toggle(attribute.id)}
                          />
                        </TableCell>
                        <TableCell data-test-id="name">
                          {attribute.name ? (
                            <Box display="inline-flex" maxWidth="100%">
                              <Link href={attributeUrl(attribute.id)} color="secondary">
                                <AttributeNameWithTypeIcon
                                  name={attribute.name}
                                  inputType={attribute.inputType}
                                  secondary={attribute.slug}
                                />
                              </Link>
                            </Box>
                          ) : (
                            <Skeleton />
                          )}
                        </TableCell>
                        <TableCell className={columnStyles.colValueRequired}>
                          <AttributeValueRequiredCell valueRequired={attribute.valueRequired} />
                        </TableCell>
                        <TableCell
                          className={columnStyles.colVariant}
                          data-test-id="variant-selection"
                        >
                          <Box display="flex" alignItems="center" height="100%">
                            <VariantSelectionSwitch
                              pressed={isSelected}
                              disabled={disabled || variantSelectionDisabled}
                              disabledReason={
                                variantSelectionDisabled
                                  ? intl.formatMessage(
                                      {
                                        id: "vlLyvk",
                                        defaultMessage:
                                          "{inputType} attributes cannot be used as variant selection attributes.",
                                      },
                                      { inputType: readableAttributeInputType },
                                    )
                                  : undefined
                              }
                              onPressedChange={() =>
                                handleContainerAssign(
                                  attribute.id,
                                  isSelected,
                                  selectedVariantAttributes,
                                  setSelectedVariantAttributes,
                                )
                              }
                            />
                          </Box>
                        </TableCell>
                        <TableCell className={tableStyles.actionsCell}>
                          <Box
                            className={tableStyles.rowDelete}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            paddingRight={ASSIGNABLE_LIST_TABLE_ACTION_INSET}
                            width="100%"
                            height="100%"
                          >
                            <TableButtonWrapper>
                              <Button
                                data-test-id="delete-icon"
                                disabled={disabled}
                                variant="tertiary"
                                type="button"
                                onClick={() => onAttributeUnassign(attribute.id)}
                                title={intl.formatMessage(buttonMessages.delete)}
                                icon={
                                  <Trash2
                                    size={iconSize.small}
                                    strokeWidth={iconStrokeWidthBySize.small}
                                  />
                                }
                              />
                            </TableButtonWrapper>
                          </Box>
                        </TableCell>
                      </SortableTableRow>
                    );
                  },
                )}
              </SortableTableBody>
            )}
          </ResponsiveTable>
        </>
      ) : null}
    </AssignableListCard>
  );
};

ProductTypeVariantAttributes.displayName = "ProductTypeVariantAttributes";
export default ProductTypeVariantAttributes;
