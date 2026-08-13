// @ts-strict-ignore
import { rippleTypePageCreateAttribute } from "@dashboard/attributes/ripples/typePageCreateAttribute";
import { attributeUrl } from "@dashboard/attributes/urls";
import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { ASSIGNABLE_LIST_TABLE_ACTION_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { ProductAttributeType, type ProductTypeDetailsQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableBody, TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useOptimisticListReorder } from "../../hooks/useOptimisticListReorder";
import columnStyles from "../AttributeListTableSkeleton/attributeListTableColumns.module.css";
import { AttributeListTableSkeletonRows } from "../AttributeListTableSkeleton/AttributeListTableSkeleton";
import { AttributeValueRequiredCell } from "../AttributeValueRequiredCell/AttributeValueRequiredCell";
import { messages as valueRequiredMessages } from "../AttributeValueRequiredCell/messages";
import { messages } from "./messages";

const useStyles = makeStyles(
  {
    colName: {},
    link: {
      cursor: "pointer",
    },
  },
  { name: "ProductTypeAttributes" },
);

interface ProductTypeAttributesProps extends ListActions {
  attributes: NonNullable<ProductTypeDetailsQuery["productType"]>["productAttributes"] | undefined;
  disabled: boolean;
  type: string;
  testId?: string;
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeCreate: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 6;
const ProductTypeAttributes = (props: ProductTypeAttributesProps) => {
  const {
    attributes,
    disabled,
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
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const attributeType = ProductAttributeType[type];
  const handleAssignAttribute = () => onAttributeAssign(attributeType);
  const handleCreateAttribute = () => onAttributeCreate(attributeType);
  const { items: orderedAttributes, onSortEnd } = useOptimisticListReorder(
    attributes,
    onAttributeReorder,
  );
  const isLoading = attributes === undefined;

  return (
    <AssignableListCard
      data-test-id="product-attributes"
      title={intl.formatMessage(messages.title)}
      intro={
        <Text size={3} color="default2">
          <FormattedMessage {...messages.intro} />
        </Text>
      }
      headerEnd={
        <Box position="relative">
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
                testId: "create-product-attribute",
                onSelect: handleCreateAttribute,
              },
            ]}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </ButtonGroupWithDropdown>
          <Box position="absolute" __top="-4px" __right="-4px">
            <Ripple model={rippleTypePageCreateAttribute} />
          </Box>
        </Box>
      }
    >
      {!isLoading && attributes?.length === 0 ? (
        <Box padding={4}>
          <Placeholder>
            <FormattedMessage {...messages.empty} />
          </Placeholder>
        </Box>
      ) : (
        <ResponsiveTable bleed className={tableStyles.assignableTable}>
          <colgroup>
            <col className={tableStyles.dragCell} />
            <col className={tableStyles.checkboxCell} />
            <col className={classes.colName} />
            <col className={columnStyles.colValueRequired} />
            <col className={columnStyles.colVariant} />
            <col className={tableStyles.actionsCell} />
          </colgroup>
          <TableHead
            colSpan={numberOfColumns}
            compact
            disabled={disabled || isLoading}
            dragRows
            selected={selected}
            items={isLoading ? undefined : orderedAttributes}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <Text size={2} lineHeight={2} color="default2">
                <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
              </Text>
            </TableCell>
            <TableCell className={columnStyles.colValueRequired}>
              <Text size={2} lineHeight={2} color="default2">
                <FormattedMessage {...valueRequiredMessages.column} />
              </Text>
            </TableCell>
            <TableCell className={columnStyles.colVariant} aria-hidden />
            <TableCell />
          </TableHead>
          {isLoading ? (
            <TableBody data-test-id="product-attributes-skeleton" aria-busy="true">
              <AttributeListTableSkeletonRows variantColumn="spacer" />
            </TableBody>
          ) : (
            <SortableTableBody onSortEnd={onSortEnd}>
              {orderedAttributes.map((attribute, attributeIndex) => {
                const isSelected = attribute ? isChecked(attribute.id) : false;

                return (
                  <SortableTableRow
                    selected={isSelected}
                    className={clsx(attribute && classes.link, tableStyles.row)}
                    hover={!!attribute}
                    href={attribute ? attributeUrl(attribute.id) : undefined}
                    key={attribute.id}
                    id={attribute.id}
                    index={attributeIndex || 0}
                    data-test-id={"id-" + attribute.id}
                  >
                    <TableCell className={tableStyles.checkboxCell}>
                      <Box
                        display="flex"
                        alignItems="center"
                        height="100%"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onMouseDown={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          onCheckedChange={() => toggle(attribute.id)}
                        />
                      </Box>
                    </TableCell>
                    <TableCell className={classes.colName} data-test-id="name">
                      {attribute?.name ? (
                        <AttributeNameWithTypeIcon
                          name={attribute.name}
                          inputType={attribute.inputType}
                          secondary={attribute.slug}
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={columnStyles.colValueRequired}>
                      {attribute ? (
                        <AttributeValueRequiredCell valueRequired={attribute.valueRequired} />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={columnStyles.colVariant} aria-hidden />
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
          )}
        </ResponsiveTable>
      )}
    </AssignableListCard>
  );
};

ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
