// @ts-strict-ignore
import { rippleTypePageCreateAttribute } from "@dashboard/attributes/ripples/typePageCreateAttribute";
import { attributeUrl } from "@dashboard/attributes/urls";
import { ASSIGNABLE_LIST_TABLE_ACTION_INSET } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { AttributeNameWithTypeIcon } from "@dashboard/components/AttributeInputTypeIcon/AttributeNameWithTypeIcon";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { type AttributeFragment, ProductAttributeType } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type ListActions, type ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Checkbox, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { type MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  {
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
    <DetailSettingsCard
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
      contentFlush
    >
      {attributes === undefined ? (
        <Box padding={6}>
          <Skeleton />
        </Box>
      ) : attributes.length === 0 ? (
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
            <col className={classes.colSlug} />
            <col className={tableStyles.actionsCell} />
          </colgroup>
          <TableHead
            colSpan={numberOfColumns}
            compact
            disabled={disabled}
            dragRows
            selected={selected}
            items={attributes}
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
            <TableCell />
          </TableHead>
          <SortableTableBody onSortEnd={onAttributeReorder}>
            {attributes.map((attribute, attributeIndex) => {
              const isSelected = attribute ? isChecked(attribute.id) : false;

              return (
                <SortableTableRow
                  selected={isSelected}
                  className={clsx(attribute && classes.link, tableStyles.row)}
                  hover={!!attribute}
                  href={attribute ? attributeUrl(attribute.id) : undefined}
                  key={attribute.id}
                  index={attributeIndex || 0}
                  data-test-id={"id-" + attribute.id}
                >
                  <TableCell className={tableStyles.checkboxCell}>
                    <Box
                      display="flex"
                      alignItems="center"
                      height="100%"
                      onClick={(event: MouseEvent) => event.stopPropagation()}
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
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colSlug} data-test-id="slug">
                    {attribute?.slug || <Skeleton />}
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
      )}
    </DetailSettingsCard>
  );
};

ProductTypeAttributes.displayName = "ProductTypeAttributes";
export default ProductTypeAttributes;
