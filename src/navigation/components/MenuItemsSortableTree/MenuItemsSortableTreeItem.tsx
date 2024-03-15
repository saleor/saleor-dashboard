import { TreeItemComponentProps } from "@dashboard/components/SortableTree/types";
import { buttonMessages } from "@dashboard/intl";
import { MenuItemType } from "@dashboard/navigation/components/MenuItemDialog";
import { RecursiveMenuItem } from "@dashboard/navigation/types";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  Box,
  Button,
  EditIcon,
  GripIcon,
  Text,
  TrashBinIcon,
} from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { getItemId, getItemType } from "./utils";

interface TreeItemProps extends TreeItemComponentProps<RecursiveMenuItem> {
  onClick: (id: UniqueIdentifier, menuItemType: MenuItemType) => void;
  onEdit: (id: UniqueIdentifier) => void;
  onRemove: (id: UniqueIdentifier) => void;
}

export const MenuItemsSortableTreeItem = ({
  innerRef,
  id,
  data,
  childCount,
  clone,
  depth,
  disableInteraction,
  ghost,
  handleProps,
  indentationWidth,
  style,
  wrapperRef,
  onEdit,
  onClick,
  onRemove,
}: TreeItemProps) => {
  return (
    <Box
      ref={wrapperRef}
      __marginLeft={`${indentationWidth * depth}px`}
      __marginBottom="-1px"
      {...(clone && {
        __pointerEvents: "none",
      })}
      {...(ghost && {
        opacity: "0.6",
      })}
      pointerEvents={disableInteraction ? "none" : undefined}
    >
      <Box
        position="relative"
        borderColor="default1"
        borderStyle="solid"
        borderWidth={1}
        backgroundColor="default1"
        padding={3}
        paddingLeft={5}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        boxShadow={clone ? "defaultOverlay" : "none"}
        ref={innerRef}
        style={style}
      >
        <Box display="flex" gap={6} alignItems="center">
          <Button variant="tertiary" __cursor="grab" {...handleProps}>
            <GripIcon color="default1" />
          </Button>
          <Text>{data.name}</Text>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="secondary"
            onClick={() => onClick(getItemId(data), getItemType(data))}
          >
            <FormattedMessage {...buttonMessages.show} />
          </Button>
          <Button variant="secondary" onClick={() => onEdit(id)}>
            <EditIcon />
          </Button>
          <Button variant="secondary" onClick={() => onRemove(id)}>
            <TrashBinIcon />
          </Button>
        </Box>
        {clone && childCount && childCount > 1 ? (
          <Box
            position="absolute"
            __top="-10px"
            __right="-10px"
            width={6}
            height={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            backgroundColor="accent1"
            size={3}
            fontWeight="medium"
            color="default1"
          >
            {childCount}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
