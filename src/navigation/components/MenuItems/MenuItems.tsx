import { Card, CardActions, Paper, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { MenuDetailsFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { Button, DeleteIcon, IconButton, useTheme } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import SortableTree, { NodeRendererProps, TreeItem } from "react-sortable-tree";

import Draggable from "../../../icons/Draggable";
import { MenuItemType } from "../MenuItemDialog";
import { NODE_HEIGHT, NODE_MARGIN, useStyles } from "./styles";
import { getDiff, getNodeData, getNodeQuantity, TreeOperation } from "./tree";

export interface MenuItemsProps {
  canUndo: boolean;
  items: MenuDetailsFragment["items"];
  onChange: (operations: TreeOperation[]) => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  onUndo: () => void;
}

interface NodeChangeEventData {
  id: string;
  type: string;
}

export interface MenuItemNode {
  id: string;
}

export interface MenuItemNodeProps extends MenuItemNode {
  onEdit: () => void;
  onClick: () => void;
  onChange: (treeData: NodeChangeEventData[]) => void;
}

const Placeholder: React.FC = props => {
  const classes = useStyles(props);

  return (
    <Paper className={classes.row} elevation={0}>
      <Typography>
        <FormattedMessage
          id="WwZfNK"
          defaultMessage="Add new menu item to begin creating menu"
        />
      </Typography>
    </Paper>
  );
};

const Node: React.FC<NodeRendererProps<MenuItemNodeProps>> = props => {
  const {
    node,
    path,
    connectDragPreview,
    connectDragSource,
    isDragging,
  } = props;
  const classes = useStyles(props);

  const draggedClassName = classNames(
    classes.rowContainer,
    classes.rowContainerDragged,
  );
  const defaultClassName = isDragging ? draggedClassName : classes.rowContainer;
  const placeholderClassName = classNames(
    classes.rowContainer,
    classes.rowContainerPlaceholder,
  );

  const [className, setClassName] = React.useState(defaultClassName);
  React.useEffect(() => setClassName(defaultClassName), [isDragging]);

  const handleDragStart = () => {
    setClassName(placeholderClassName);
    setTimeout(() => setClassName(defaultClassName), 0);
  };

  return connectDragPreview(
    <div
      className={className}
      style={{
        marginLeft: NODE_MARGIN * (path.length - 1),
      }}
    >
      <Paper className={classes.row} elevation={0}>
        {connectDragSource(
          <div onDragStart={handleDragStart}>
            <Draggable className={classes.dragIcon} />
          </div>,
        )}
        <Typography className={classes.nodeTitle} onClick={node.onEdit}>
          {node.title}
        </Typography>
        <div className={classes.spacer} />
        <Button onClick={node.onClick}>
          <FormattedMessage {...buttonMessages.show} />
        </Button>
        <IconButton variant="secondary" onClick={node.onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton
          className={classes.deleteButton}
          variant="secondary"
          onClick={() =>
            node.onChange([
              {
                id: node.id,
                type: "remove",
              },
            ])
          }
        >
          <DeleteIcon />
        </IconButton>
      </Paper>
    </div>,
  );
};

const MenuItems: React.FC<MenuItemsProps> = props => {
  const {
    canUndo,

    items,
    onChange,
    onItemAdd,
    onItemClick,
    onItemEdit,
    onUndo,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const { themeType } = useTheme();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "dEUZg2",
          defaultMessage: "Menu Items",
          description: "header",
        })}
        toolbar={
          <Button disabled={!canUndo} onClick={onUndo}>
            <FormattedMessage {...buttonMessages.undo} />
          </Button>
        }
      />
      <div
        className={classNames(classes.container, {
          [classes.darkContainer]: themeType === "dark",
        })}
        style={{
          minHeight: (items ? getNodeQuantity(items) - 1 : 1) * NODE_HEIGHT,
          padding: !items && "0 24px",
          paddingTop: !items && 20,
        }}
      >
        {items === undefined ? (
          <Skeleton />
        ) : (
          <SortableTree
            className={classes.root}
            generateNodeProps={({ path }) => ({
              className: classes.row,
              style: {
                marginLeft: NODE_MARGIN * (path.length - 1),
              },
            })}
            maxDepth={5}
            isVirtualized={false}
            rowHeight={NODE_HEIGHT}
            treeData={items.map(item =>
              getNodeData(item, onChange, onItemClick, onItemEdit),
            )}
            theme={{
              nodeContentRenderer: Node as any,
            }}
            onChange={newTree =>
              onChange(
                getDiff(
                  items.map(item =>
                    getNodeData(item, onChange, onItemClick, onItemEdit),
                  ),
                  newTree as Array<TreeItem<MenuItemNode>>,
                ),
              )
            }
            placeholderRenderer={Placeholder as any}
          />
        )}
      </div>
      <CardActions className={classes.actions}>
        <Button onClick={onItemAdd} data-test-id="create-new-menu-item">
          <FormattedMessage
            id="Uf3oHA"
            defaultMessage="Create new item"
            description="add new menu item"
          />
        </Button>
      </CardActions>
    </Card>
  );
};
MenuItems.displayName = "MenuItems";
export default MenuItems;
