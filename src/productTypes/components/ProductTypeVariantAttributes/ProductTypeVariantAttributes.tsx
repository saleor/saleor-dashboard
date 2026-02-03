// @ts-strict-ignore
import { attributeUrl } from "@dashboard/attributes/urls";
import { DashboardCard } from "@dashboard/components/Card";
import Checkbox from "@dashboard/components/Checkbox";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { ResponsiveTable, tableStyles } from "@dashboard/components/ResponsiveTable";
import { SortableTableBody, SortableTableRow } from "@dashboard/components/SortableTable";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@dashboard/components/TableHead";
import { ProductAttributeType, ProductTypeDetailsQuery } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { ListActions, ReorderAction } from "@dashboard/types";
import { TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Button, Skeleton, Tooltip } from "@saleor/macaw-ui-next";
import capitalize from "lodash/capitalize";
import { CircleQuestionMark, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
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
            variant="secondary"
            onClick={() => onAttributeAssign(ProductAttributeType[type])}
          >
            <FormattedMessage id="uxPpRx" defaultMessage="Assign attribute" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <Box paddingX={6}>
        <DashboardCard.Subtitle fontSize={3} color="default2">
          <FormattedMessage
            id="Uxhquh"
            defaultMessage="Product attributes and variant attributes are mutually exclusive. An attribute cannot be assigned to both sections within the same product type."
            description="info message about attribute exclusivity in product type"
          />
        </DashboardCard.Subtitle>
      </Box>
      <DashboardCard.Content>
        {!assignedVariantAttributes?.length ? (
          <Placeholder>
            <FormattedMessage id="ztQgD8" defaultMessage="No attributes found" />
          </Placeholder>
        ) : (
          <ResponsiveTable>
            <colgroup>
              <col className={classes.colGrab} />
              <col />
              <col className={classes.colName} />
              <col className={classes.colSlug} />
              <col className={classes.colVariant} />
              <col className={tableStyles.colAction} />
            </colgroup>
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
                <Box display="flex" alignItems="center" gap={1}>
                  <FormattedMessage
                    id="4k9rMQ"
                    defaultMessage="Variant Selection"
                    description="variant attribute checkbox"
                  />
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
                        id="xfypNP"
                        defaultMessage="When enabled, this attribute will be used to distinguish variants on the storefront."
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
                      </div>
                    </TableCell>
                    <TableCell className={tableStyles.colAction}>
                      <TableButtonWrapper>
                        <Button
                          data-test-id="delete-icon"
                          disabled={disabled}
                          variant="secondary"
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

ProductTypeVariantAttributes.displayName = "ProductTypeVariantAttributes";
export default ProductTypeVariantAttributes;
