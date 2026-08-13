// @ts-strict-ignore
import { attributeUrl } from "@dashboard/attributes/urls";
import { ASSIGNABLE_LIST_TABLE_ACTION_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DetailSettingToggleRow } from "@dashboard/components/DetailSettingToggleRow/DetailSettingToggleRow";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { ProductAttributeType, type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { maybe } from "@dashboard/misc";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Checkbox, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import capitalize from "lodash/capitalize";
import { CircleQuestionMark, Trash2 } from "lucide-react";
import { type MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductTypeVariantAttributes.module.css";

const useStyles = makeStyles(
  theme => ({
    colName: {
      width: 200,
    },
    colSlug: {
      width: 200,
    },
    colVariant: {
      width: 150,
    },
    colVariantContent: {
      display: "flex",
      alignItems: "center",
    },
    colVariantDisabled: {
      color: theme.palette.alert.icon.info,
      opacity: 0.6,
      "&:hover": {
        opacity: 1,
      },
    },
    link: {
      cursor: "pointer",
    },
  }),
  { name: "ProductTypeVariantAttributes" },
);

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
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const attributeType = ProductAttributeType[type];
  const handleAssignAttribute = () => onAttributeAssign(attributeType);
  const handleCreateAttribute = () => onAttributeCreate(attributeType);

  return (
    <DetailSettingsCard
      data-test-id="variant-attributes"
      title={intl.formatMessage(messages.title)}
      headerEnd={
        hasVariants ? (
          <ButtonGroupWithDropdown
            variant="secondary"
            disabled={disabled}
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
      contentFlush
    >
      <DetailSettingToggleRow
        title={<FormattedMessage {...messages.usesVariantAttributes} />}
        description={<FormattedMessage {...messages.usesVariantAttributesDescription} />}
        pressed={hasVariants}
        disabled={disabled}
        testId="hasVariants"
        onPressedChange={onHasVariantsToggle}
      />
      {hasVariants ? (
        assignedVariantAttributes?.length ? (
          <>
            <Box className={styles.hint}>
              <Text size={3} color="default2">
                <FormattedMessage {...messages.exclusivity} />
              </Text>
            </Box>
            <ResponsiveTable bleed className={tableStyles.assignableTable}>
              <colgroup>
                <col className={tableStyles.dragCell} />
                <col className={tableStyles.checkboxCell} />
                <col className={classes.colName} />
                <col className={classes.colSlug} />
                <col className={classes.colVariant} />
                <col className={tableStyles.actionsCell} />
              </colgroup>
              <TableHead
                colSpan={numberOfColumns}
                compact
                disabled={disabled}
                dragRows
                selected={selected}
                items={assignedVariantAttributes?.map(
                  selectedAttribute => selectedAttribute.attribute,
                )}
                toggleAll={toggleAll}
                toolbar={toolbar}
              >
                <TableCell className={classes.colName}>
                  <Text size={2} lineHeight={2} color="default2">
                    <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
                  </Text>
                </TableCell>
                <TableCell className={classes.colName}>
                  <Text size={2} lineHeight={2} color="default2">
                    <FormattedMessage
                      id="nf3XSt"
                      defaultMessage="Slug"
                      description="attribute internal name"
                    />
                  </Text>
                </TableCell>
                <TableCell className={classes.colName}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Text size={2} lineHeight={2} color="default2">
                      <FormattedMessage
                        id="MnScte"
                        defaultMessage="Variant selection"
                        description="variant attribute checkbox"
                      />
                    </Text>
                    <Tooltip>
                      <Tooltip.Trigger>
                        <Box color="default2" display="flex" alignItems="center">
                          <CircleQuestionMark
                            size={iconSize.small}
                            strokeWidth={iconStrokeWidthBySize.small}
                          />
                        </Box>
                      </Tooltip.Trigger>
                      <Tooltip.Content side="bottom">
                        <Tooltip.Arrow />
                        <FormattedMessage
                          id="6n16Pt"
                          defaultMessage="Customers pick these to choose a variant — for example Small or Blue."
                          description="tooltip for variant selection column header"
                        />
                      </Tooltip.Content>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell />
              </TableHead>
              <SortableTableBody onSortEnd={onAttributeReorder}>
                {assignedVariantAttributes.map((assignedVariantAttribute, attributeIndex) => {
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
                      className={clsx(attribute && classes.link, tableStyles.row)}
                      hover={!!attribute}
                      href={attribute ? attributeUrl(attribute.id) : undefined}
                      key={maybe(() => attribute.id)}
                      index={attributeIndex || 0}
                      data-test-id={"id-" + +maybe(() => attribute.id)}
                    >
                      <TableCell className={tableStyles.checkboxCell}>
                        <Box
                          display="flex"
                          alignItems="center"
                          height="100%"
                          onClick={(event: MouseEvent) => event.stopPropagation()}
                        >
                          <Checkbox
                            checked={isVariantSelected}
                            disabled={disabled}
                            onCheckedChange={() => toggle(attribute.id)}
                          />
                        </Box>
                      </TableCell>
                      <TableCell className={classes.colName} data-test-id="name">
                        {attribute.name ? (
                          <AttributeNameWithTypeIcon
                            name={attribute.name}
                            inputType={attribute.inputType}
                          />
                        ) : (
                          <Skeleton />
                        )}
                      </TableCell>
                      <TableCell className={classes.colSlug} data-test-id="slug">
                        {maybe(() => attribute.slug) ? attribute.slug : <Skeleton />}
                      </TableCell>
                      <TableCell className={classes.colVariant} data-test-id="variant-selection">
                        <Box
                          className={classes.colVariantContent}
                          onClick={(event: MouseEvent) => event.stopPropagation()}
                        >
                          <Checkbox
                            data-test-id="variant-selection-checkbox"
                            checked={isSelected}
                            disabled={disabled || variantSelectionDisabled}
                            onCheckedChange={() =>
                              handleContainerAssign(
                                attribute.id,
                                isSelected,
                                selectedVariantAttributes,
                                setSelectedVariantAttributes,
                              )
                            }
                          />
                          {!!variantSelectionDisabled && (
                            <Tooltip>
                              <Tooltip.Trigger>
                                <CircleQuestionMark
                                  size={iconSize.small}
                                  strokeWidth={iconStrokeWidthBySize.small}
                                  className={classes.colVariantDisabled}
                                />
                              </Tooltip.Trigger>
                              <Tooltip.Content side="bottom">
                                <Tooltip.Arrow />
                                <FormattedMessage
                                  id="vlLyvk"
                                  defaultMessage="{inputType} attributes cannot be used as variant selection attributes."
                                  values={{
                                    inputType: readableAttributeInputType,
                                  }}
                                />
                              </Tooltip.Content>
                            </Tooltip>
                          )}
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
                })}
              </SortableTableBody>
            </ResponsiveTable>
          </>
        ) : (
          <Box className={styles.empty}>
            <Text size={3} color="default2">
              <FormattedMessage {...messages.exclusivity} />
            </Text>
            <Placeholder>
              <FormattedMessage {...messages.empty} />
            </Placeholder>
          </Box>
        )
      ) : null}
    </DetailSettingsCard>
  );
};

ProductTypeVariantAttributes.displayName = "ProductTypeVariantAttributes";
export default ProductTypeVariantAttributes;
