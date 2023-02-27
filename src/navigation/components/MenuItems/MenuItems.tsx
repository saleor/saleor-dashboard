// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import Skeleton from "@dashboard/components/Skeleton";
import { buttonMessages } from "@dashboard/intl";
import { RecursiveMenuItem } from "@dashboard/navigation/types";
import { Card, CardActions, Paper, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {
  Button,
  DeleteIcon,
  IconButton,
  makeStyles,
  useTheme,
} from "@saleor/macaw-ui";
import { GripIcon, vars } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import SortableTree, { NodeRendererProps } from "react-sortable-tree";

import { MenuItemType } from "../MenuItemDialog";
import {
  getDiff,
  getNodeData,
  getNodeQuantity,
  MenuTreeItem,
  TreeItemProps,
  TreeOperation,
} from "./tree";

const NODE_HEIGHT = 56;
const NODE_MARGIN = 40;

export interface MenuItemsProps {
  canUndo: boolean;
  items: RecursiveMenuItem[];
  onChange: (operations: TreeOperation[]) => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  onUndo: () => void;
}

const useStyles = makeStyles(
  theme => ({
    actions: {
      "&&": {
        padding: theme.spacing(2, 4),
      },
      flexDirection: "row",
    },
    container: {
      background: theme.palette.grey[200],
    },
    darkContainer: {
      background: `${theme.palette.grey[800]} !important`,
    },
    deleteButton: {
      marginRight: theme.spacing(1),
    },
    dragIcon: {
      cursor: "grab",
    },
    nodeTitle: {
      cursor: "pointer",
      marginLeft: theme.spacing(7),
    },
    nodeActions: {
      display: "flex",
      gap: theme.spacing(1),
    },
    root: {
      "& .rst__collapseButton": {
        display: "none",
      },
      "& .rst__node": {
        "&:first-of-type": {
          "& $row": {
            borderTop: `1px ${vars.colors.border.neutralPlain} solid`,
          },
        },
      },
    },
    row: {
      alignItems: "center",
      background: vars.colors.background.surfaceNeutralPlain,
      borderBottom: `1px ${vars.colors.border.neutralPlain} solid`,
      borderRadius: 0,
      display: "flex",
      flexDirection: "row",
      height: NODE_HEIGHT,
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(3),
    },
    rowContainer: {
      "& > *": {
        opacity: 1,
        transition: `opacity ${theme.transitions.duration.standard}ms`,
      },
      transition: `margin ${theme.transitions.duration.standard}ms`,
    },
    rowContainerDragged: {
      "&$rowContainer": {
        "&:before": {
          background: vars.colors.background.surfaceNeutralPlain,
          border: `1px solid ${vars.colors.border.neutralPlain}`,
          borderRadius: "100%",
          content: "''",
          height: 7,
          left: 0,
          position: "absolute",
          top: -3,
          width: 7,
        },
        borderTop: `1px solid ${vars.colors.border.neutralPlain}`,
        height: 0,
        position: "relative",
        top: -1,
      },
    },
    rowContainerPlaceholder: {
      opacity: 0,
    },
    spacer: {
      flex: 1,
    },
  }),
  { name: "MenuItems" },
);

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

const Node: React.FC<NodeRendererProps<TreeItemProps>> = props => {
  const { node, path, connectDragPreview, connectDragSource, isDragging } =
    props;
  const classes = useStyles(props);

  const draggedClassName = clsx(
    classes.rowContainer,
    classes.rowContainerDragged,
  );
  const defaultClassName = isDragging ? draggedClassName : classes.rowContainer;
  const placeholderClassName = clsx(
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
            <GripIcon color="iconNeutralDefault" />
          </div>,
        )}
        <Typography className={classes.nodeTitle} onClick={node.onEdit}>
          {node.title}
        </Typography>
        <div className={classes.spacer} />
        <div className={classes.nodeActions}>
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
        </div>
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
        className={clsx(classes.container, {
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
              nodeContentRenderer: Node,
            }}
            onChange={newTree =>
              onChange(
                getDiff(
                  items.map(item =>
                    getNodeData(item, onChange, onItemClick, onItemEdit),
                  ),
                  newTree as MenuTreeItem[],
                ),
              )
            }
            placeholderRenderer={Placeholder}
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
