// @ts-strict-ignore
import { rippleTypePageCreateAttribute } from "@dashboard/attributes/ripples/typePageCreateAttribute";
import { attributeUrl } from "@dashboard/attributes/urls";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { type AttributeFragment, ProductAttributeType } from "@dashboard/graphql";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./ProductTypeAttributes.module.css";

const useStyles = makeStyles(
  {
    colGrab: {
      width: 60,
    },
    colName: {},
    colSlug: {
      width: 300,
    },
    link: {
      cursor: "pointer",
    },
  },
  { name: "ProductTypeAttributes" },
);

interface ProductTypeAttributesProps extends ListActions {
  attributes: AttributeFragment[];
  disabled: boolean;
  type: string;
  testId?: string;
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeCreate: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;
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

  return (
    <DashboardCard data-test-id="product-attributes">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "9scTQ0",
            defaultMessage: "Product Attributes",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
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
              <FormattedMessage
                id="uxPpRx"
                defaultMessage="Assign attribute"
                description="button"
              />
            </ButtonGroupWithDropdown>
            <Box position="absolute" __top="-4px" __right="-4px">
              <Ripple model={rippleTypePageCreateAttribute} />
            </Box>
          </Box>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {attributes === undefined ? (
          <Skeleton />
        ) : attributes.length === 0 ? (
          <Box
            className={styles.emptyState}
            borderRadius={4}
            borderColor="default1"
            borderWidth={1}
            padding={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text size={2} color="default2" textAlign="center">
              <FormattedMessage id="ztQgD8" defaultMessage="No attributes found" />
            </Text>
          </Box>
        ) : (
          <ResponsiveTable>
            <colgroup>
              <col className={classes.colGrab} />
              <col />
              <col className={classes.colName} />
              <col className={classes.colSlug} />
              <col className={tableStyles.colAction} />
            </colgroup>
            <TableHead
              colSpan={numberOfColumns}
              disabled={disabled}
              dragRows
              selected={selected}
              items={attributes}
              toggleAll={toggleAll}
              toolbar={toolbar}
            >
              <TableCell className={classes.colName}>
                <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
              </TableCell>
              <TableCell className={classes.colName}>
                <FormattedMessage
                  id="nf3XSt"
                  defaultMessage="Slug"
                  description="attribute internal name"
                />
              </TableCell>
              <TableCell />
            </TableHead>
            <SortableTableBody onSortEnd={onAttributeReorder}>
              {attributes.map((attribute, attributeIndex) => {
                const isSelected = attribute ? isChecked(attribute.id) : false;

                return (
                  <SortableTableRow
                    selected={isSelected}
                    className={attribute ? classes.link : undefined}
                    hover={!!attribute}
                    href={attribute ? attributeUrl(attribute.id) : undefined}
                    key={attribute.id}
                    index={attributeIndex || 0}
                    data-test-id={"id-" + attribute.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(attribute.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName} data-test-id="name">
                      {attribute?.name ? (
                        <AttributeNameWithTypeIcon
                          name={attribute.name}
                          inputType={attribute.inputType}
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colSlug} data-test-id="slug">
                      {attribute?.slug || <Skeleton />}
                    </TableCell>
                    <TableCell className={tableStyles.colAction}>
                      <TableButtonWrapper>
                        <Button
                          data-test-id="delete-icon"
                          disabled={disabled}
                          variant="tertiary"
                          onClick={() => onAttributeUnassign(attribute.id)}
                          icon={
                            <Trash2
                              size={iconSize.small}
                              strokeWidth={iconStrokeWidthBySize.small}
                            />
                          }
                        />
                      </TableButtonWrapper>
                    </TableCell>
                  </SortableTableRow>
                );
              })}
            </SortableTableBody>
          </ResponsiveTable>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
