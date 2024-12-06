// @ts-strict-ignore
import { attributeUrl } from "@dashboard/attributes/urls";
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import TableRowLink from "@dashboard/components/TableRowLink";
import { ProductAttributeType, ProductTypeDetailsQuery } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import { ListActions, ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Tooltip } from "@saleor/macaw-ui-next";
import capitalize from "lodash/capitalize";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: 0,
      },
      width: 80,
    },
    colGrab: {
      width: 60,
    },
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
      fill: theme.palette.alert.icon.info,
      fillOpacity: 0.6,
      "&:hover": {
        fillOpacity: 1,
      },
    },
    link: {
      cursor: "pointer",
    },
    textLeft: {
      textAlign: "left",
    },
  }),
  { name: "ProductTypeAttributes" },
);

interface ProductTypeVariantAttributesProps extends ListActions {
  assignedVariantAttributes: ProductTypeDetailsQuery["productType"]["assignedVariantAttributes"];
  disabled: boolean;
  type: string;
  testId?: string;
  selectedVariantAttributes: string[];
  onAttributeAssign: (type: ProductAttributeType) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
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
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    type,
    testId,
    onAttributeAssign,
    onAttributeReorder,
    onAttributeUnassign,
    setSelectedVariantAttributes,
    selectedVariantAttributes,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  useEffect(() => {
    // Populate initial selection - populated inside this component to preserve it's state between data reloads
    setSelectedVariantAttributes(
      assignedVariantAttributes
        .map(elem => (elem.variantSelection ? elem.attribute.id : undefined))
        .filter(Boolean) || [],
    );
  }, []);

  return (
    <DashboardCard data-test-id="variant-attributes">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "skEK/i",
            defaultMessage: "Variant Attributes",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            data-test-id={testId}
            variant="tertiary"
            onClick={() => onAttributeAssign(ProductAttributeType[type])}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <ResponsiveTable>
          <colgroup>
            <col className={classes.colGrab} />
            <col />
            <col className={classes.colName} />
            <col className={classes.colSlug} />
            <col className={classes.colVariant} />
            <col className={classes.colAction} />
          </colgroup>
          {assignedVariantAttributes?.length > 0 && (
            <TableHead
              colSpan={numberOfColumns}
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
                <FormattedMessage id="kTr2o8" defaultMessage="Attribute name" />
              </TableCell>
              <TableCell className={classes.colName}>
                <FormattedMessage
                  id="nf3XSt"
                  defaultMessage="Slug"
                  description="attribute internal name"
                />
              </TableCell>
              <TableCell className={classes.colName}>
                <FormattedMessage
                  id="4k9rMQ"
                  defaultMessage="Variant Selection"
                  description="variant attribute checkbox"
                />
              </TableCell>
              <TableCell />
            </TableHead>
          )}
          <SortableTableBody onSortEnd={onAttributeReorder}>
            {renderCollection(
              assignedVariantAttributes,
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
                    className={attribute ? classes.link : undefined}
                    hover={!!attribute}
                    href={attribute ? attributeUrl(attribute.id) : undefined}
                    key={maybe(() => attribute.id)}
                    index={attributeIndex || 0}
                    data-test-id={"id-" + +maybe(() => attribute.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isVariantSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(attribute.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName} data-test-id="name">
                      {attribute.name ?? <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colSlug} data-test-id="slug">
                      {maybe(() => attribute.slug) ? attribute.slug : <Skeleton />}
                    </TableCell>
                    <TableCell className={classes.colVariant} data-test-id="variant-selection">
                      <div className={classes.colVariantContent}>
                        <Checkbox
                          data-test-id="variant-selection-checkbox"
                          checked={isSelected}
                          disabled={disabled || variantSelectionDisabled}
                          disableClickPropagation
                          onChange={() =>
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
                              <HelpOutline className={classes.colVariantDisabled} />
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
                      </div>
                    </TableCell>
                    <TableCell className={classes.colAction}>
                      <TableButtonWrapper>
                        <IconButton
                          data-test-id="delete-icon"
                          onClick={() => onAttributeUnassign(attribute.id)}
                          variant="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableButtonWrapper>
                    </TableCell>
                  </SortableTableRow>
                );
              },
              () => (
                <TableRowLink>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage id="ztQgD8" defaultMessage="No attributes found" />
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </SortableTableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeVariantAttributes.displayName = "ProductTypeVariantAttributes";
export default ProductTypeVariantAttributes;
