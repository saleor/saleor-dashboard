import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import {
  SortableTableBody,
  SortableTableRow
} from "@saleor/components/SortableTable";
import TableHead from "@saleor/components/TableHead";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { PageTypeDetails_pageType_attributes } from "@saleor/pageTypes/types/PageTypeDetails";
import { ListActions, ReorderAction } from "@saleor/types";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  {
    colAction: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 80
    },
    colGrab: {
      width: 60
    },
    colName: {},
    colSlug: {
      width: 300
    },
    link: {
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left"
    }
  },
  { name: "PageTypeAttributes" }
);

interface PageTypeAttributesProps extends ListActions {
  attributes: PageTypeDetails_pageType_attributes[];
  disabled: boolean;
  type: string;
  onAttributeAssign: (type: AttributeTypeEnum) => void;
  onAttributeClick: (id: string) => void;
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
    onAttributeClick,
    onAttributeReorder,
    onAttributeUnassign
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card data-test="page-attributes">
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Content Attributes",
          description: "section header"
        })}
        toolbar={
          <Button
            color="primary"
            variant="text"
            onClick={() => onAttributeAssign(AttributeTypeEnum[type])}
          >
            <FormattedMessage
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
              <FormattedMessage defaultMessage="Attribute name" />
            </TableCell>
            <TableCell className={classes.colName}>
              <FormattedMessage
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
                  onClick={
                    !!attribute
                      ? () => onAttributeClick(attribute.id)
                      : undefined
                  }
                  key={attribute?.id}
                  index={attributeIndex || 0}
                  data-test="id"
                  data-test-id={attribute?.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(attribute.id)}
                    />
                  </TableCell>
                  <TableCell className={classes.colName} data-test="name">
                    {attribute?.name || <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colSlug} data-test="slug">
                    {attribute?.slug || <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <IconButton
                      onClick={stopPropagation(() =>
                        onAttributeUnassign(attribute.id)
                      )}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </SortableTableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage defaultMessage="No attributes found" />
                </TableCell>
              </TableRow>
            )
          )}
        </SortableTableBody>
      </ResponsiveTable>
    </Card>
  );
};
PageTypeAttributes.displayName = "PageTypeAttributes";
export default PageTypeAttributes;
