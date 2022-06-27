import { Card, TableCell, TableRow } from "@material-ui/core";
import { attributeUrl } from "@saleor/attributes/urls";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow,
} from "@saleor/components/SortableTable";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableHead from "@saleor/components/TableHead";
import { AttributeFragment, AttributeTypeEnum } from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { ListActions, ReorderAction } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    colAction: {
      "&:last-child": {
        paddingRight: 0,
      },
      width: 80,
    },
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
    textLeft: {
      textAlign: "left",
    },
  },
  { name: "PageTypeAttributes" },
);

interface PageTypeAttributesProps extends ListActions {
  attributes: AttributeFragment[];
  disabled: boolean;
  type: string;
  onAttributeAssign: (type: AttributeTypeEnum) => void;
  onAttributeReorder: ReorderAction;
  onAttributeUnassign: (id: string) => void;
}

const numberOfColumns = 5;

const PageTypeAttributes: React.FC<PageTypeAttributesProps> = props => {
  const {
    attributes,
    disabled,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
    type,
    onAttributeAssign,
    onAttributeReorder,
    onAttributeUnassign,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card data-test-id="page-attributes">
      <CardTitle
        title={intl.formatMessage({
          id: "iQxjow",
          defaultMessage: "Content Attributes",
          description: "section header",
        })}
        toolbar={
          <Button
            variant="tertiary"
            onClick={() => onAttributeAssign(AttributeTypeEnum[type])}
            data-test-id="assign-attributes"
          >
            <FormattedMessage
              id="uxPpRx"
              defaultMessage="Assign attribute"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable>
        <colgroup>
          <col className={classes.colGrab} />
          <col />
          <col className={classes.colName} />
          <col className={classes.colSlug} />
          <col className={classes.colAction} />
        </colgroup>
        {attributes?.length > 0 && (
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
        )}
        <SortableTableBody onSortEnd={onAttributeReorder}>
          {renderCollection(
            attributes,
            (attribute, attributeIndex) => {
              const isSelected = attribute ? isChecked(attribute.id) : false;

              return (
                <SortableTableRow
                  selected={isSelected}
                  className={!!attribute ? classes.link : undefined}
                  hover={!!attribute}
                  href={attribute ? attributeUrl(attribute.id) : undefined}
                  key={attribute?.id}
                  index={attributeIndex || 0}
                  data-test-id={"id-" + attribute?.id}
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
                    {attribute?.name || <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colSlug} data-test-id="slug">
                    {attribute?.slug || <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <TableButtonWrapper>
                      <IconButton
                        variant="secondary"
                        onClick={() => onAttributeUnassign(attribute.id)}
                      >
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </TableButtonWrapper>
                  </TableCell>
                </SortableTableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="ztQgD8"
                    defaultMessage="No attributes found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
PageTypeAttributes.displayName = "PageTypeAttributes";
export default PageTypeAttributes;
