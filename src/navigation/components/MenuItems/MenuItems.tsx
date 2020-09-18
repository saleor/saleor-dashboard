import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import useTheme from "@saleor/hooks/useTheme";
import { buttonMessages } from "@saleor/intl";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import SortableTree, { NodeRendererProps, TreeItem } from "react-sortable-tree";

import Draggable from "../../../icons/Draggable";
import { MenuDetails_menu_items } from "../../types/MenuDetails";
import { MenuItemType } from "../MenuItemDialog";
import { getDiff, getNodeData, getNodeQuantity, TreeOperation } from "./tree";

const NODE_HEIGHT = 56;
const NODE_MARGIN = 40;

export interface MenuItemsProps {
  canUndo: boolean;
  items: MenuDetails_menu_items[];
  onChange: (operation: TreeOperation) => void;
  onItemAdd: () => void;
  onItemClick: (id: string, type: MenuItemType) => void;
  onItemEdit: (id: string) => void;
  onUndo: () => void;
}

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row"
    },
    container: {
      background: theme.palette.grey[200]
    },
    darkContainer: {
      background: `${theme.palette.grey[800]} !important`
    },
    deleteButton: {
      marginRight: theme.spacing(1)
    },
    dragIcon: {
      cursor: "grab"
    },
    nodeTitle: {
      cursor: "pointer",
      marginLeft: theme.spacing(7)
    },
    root: {
      "& .rst__collapseButton": {
        display: "none"
      },
      "& .rst__node": {
        "&:first-of-type": {
          "& $row": {
            borderTop: `1px ${theme.palette.divider} solid`
          }
        }
      }
    },
    row: {
      alignItems: "center",
      background: theme.palette.background.paper,
      borderBottom: `1px ${theme.palette.divider} solid`,
      borderRadius: 0,
      display: "flex",
      flexDirection: "row",
      height: NODE_HEIGHT,
      justifyContent: "flex-start",
      paddingLeft: theme.spacing(3)
    },
    rowContainer: {
      "& > *": {
        opacity: 1,
        transition: `opacity ${theme.transitions.duration.standard}ms`
      },
      transition: `margin ${theme.transitions.duration.standard}ms`
    },
    rowContainerDragged: {
      "&$rowContainer": {
        "&:before": {
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: "100%",
          content: "''",
          height: 7,
          left: 0,
          position: "absolute",
          top: -3,
          width: 7
        },
        borderTop: `1px solid ${theme.palette.primary.main}`,
        height: 0,
        position: "relative",
        top: -1
      }
    },
    rowContainerPlaceholder: {
      opacity: 0
    },
    spacer: {
      flex: 1
    }
  }),
  { name: "MenuItems" }
);

const Placeholder: React.FC = props => {
  const classes = useStyles(props);

  return (
    <Paper className={classes.row} elevation={0}>
      <Typography>
        <FormattedMessage
          defaultMessage="Add new menu item to begin creating menu"
          id="menuItemsPlaceholder"
        />
      </Typography>
    </Paper>
  );
};

const Node: React.FC<NodeRendererProps> = props => {
  const {
    node,
    path,
    connectDragPreview,
    connectDragSource,
    isDragging
  } = props;
  const classes = useStyles(props);

  const draggedClassName = classNames(
    classes.rowContainer,
    classes.rowContainerDragged
  );
  const defaultClassName = isDragging ? draggedClassName : classes.rowContainer;
  const placeholderClassName = classNames(
    classes.rowContainer,
    classes.rowContainerPlaceholder
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
        marginLeft: NODE_MARGIN * (path.length - 1)
      }}
    >
      <Paper className={classes.row} elevation={0}>
        {connectDragSource(
          <div onDragStart={handleDragStart}>
            <Draggable className={classes.dragIcon} />
          </div>
        )}
        <Typography className={classes.nodeTitle} onClick={node.onEdit}>
          {node.title}
        </Typography>
        <div className={classes.spacer} />
        <Button color="primary" onClick={node.onClick}>
          <FormattedMessage {...buttonMessages.show} />
        </Button>
        <IconButton color="primary" onClick={node.onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton
          className={classes.deleteButton}
          color="primary"
          onClick={() =>
            node.onChange({
              id: node.id as any,
              type: "remove"
            })
          }
        >
          <DeleteIcon />
        </IconButton>
      </Paper>
    </div>
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
    onUndo
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const { isDark } = useTheme();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Menu Items",
          description: "header",
          id: "menuItemsHeader"
        })}
        toolbar={
          <Button color="primary" disabled={!canUndo} onClick={onUndo}>
            <FormattedMessage {...buttonMessages.undo} />
          </Button>
        }
      />
      <div
        className={classNames(classes.container, {
          [classes.darkContainer]: isDark
        })}
        style={{
          minHeight: (items ? getNodeQuantity(items) - 1 : 1) * NODE_HEIGHT,
          padding: !items && "0 24px",
          paddingTop: !items && 20
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
                marginLeft: NODE_MARGIN * (path.length - 1)
              }
            })}
            isVirtualized={false}
            rowHeight={NODE_HEIGHT}
            treeData={items.map(item =>
              getNodeData(item, onChange, onItemClick, onItemEdit)
            )}
            theme={{
              nodeContentRenderer: Node as any
            }}
            onChange={newTree =>
              onChange(
                getDiff(
                  items.map(item =>
                    getNodeData(item, onChange, onItemClick, onItemEdit)
                  ),
                  newTree as TreeItem[]
                )
              )
            }
            placeholderRenderer={Placeholder as any}
          />
        )}
      </div>
      <CardActions className={classes.actions}>
        <Button color="primary" onClick={onItemAdd}>
          <FormattedMessage
            defaultMessage="Create new item"
            description="add new menu item"
            id="menuItemsAddItem"
          />
        </Button>
      </CardActions>
    </Card>
  );
};
MenuItems.displayName = "MenuItems";
export default MenuItems;
