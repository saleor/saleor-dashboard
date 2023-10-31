import { buttonMessages } from "@dashboard/intl";
import {
  Box,
  Button,
  EditIcon,
  GripIcon,
  Text,
  TrashBinIcon,
} from "@saleor/macaw-ui-next";
import React, { forwardRef, HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number;
  clone?: boolean;
  depth: number;
  disableInteraction?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indentationWidth: number;
  value: string;
  onRemove?: () => void;
  wrapperRef?: (node: HTMLLIElement) => void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref,
  ) => {
    return (
      <Box
        ref={wrapperRef}
        __marginLeft={`${indentationWidth * depth}px`}
        __marginBottom="-1px"
        {...(props as any)}
        {...(clone && {
          display: "inline-block",
          pointerEvents: "none",
          padding: 0,
          paddingLeft: "3",
          paddingTop: "1",
        })}
        {...(ghost && {
          opacity: "0.6",
        })}
        pointerEvents={disableInteraction ? "none" : undefined}
      >
        <Box
          position="relative"
          borderColor="neutralPlain"
          borderStyle="solid"
          borderWidth={1}
          backgroundColor={"surfaceNeutralPlain"}
          padding={3}
          paddingLeft={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          boxShadow={clone ? "overlay" : "none"}
          ref={ref}
          style={style}
        >
          <Box display="flex" gap={6} alignItems="center">
            <Button variant="tertiary" __cursor="grab" {...handleProps}>
              <GripIcon color="iconNeutralDefault" />
            </Button>
            <Text>{value}</Text>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="secondary"
              onClick={() => console.log("Button ;cocl")}
            >
              <FormattedMessage {...buttonMessages.show} />
            </Button>
            <Button variant="secondary" onClick={console.log("on edt")}>
              <EditIcon />
            </Button>
            <Button
              variant="secondary"
              onClick={() => console.log("Delete button")}
            >
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
              backgroundColor="interactiveBrandDefault"
              fontSize="bodyEmpSmall"
              fontWeight="bodyEmpSmall"
              color="textNeutralContrasted"
            >
              {childCount}
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  },
);

TreeItem.displayName = "TreeItem";