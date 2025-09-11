import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { DialogProps, FetchMoreProps, Node } from "@dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Input, Spinner, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BackButton from "../BackButton";

export interface AssignMultipleSelectionDialogProps<T extends Node> extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  items: T[];
  loading: boolean;
  labels: {
    confirmBtn: string;
    title: string;
    label: string;
    placeholder: string;
  };
  onFetch: (value: string) => void;
  onSubmit: (data: T[]) => void;
  emptyMessage?: string;
  selectedIds?: Record<string, boolean>;
  renderRow: (item: T) => React.ReactNode;
}

const scrollableTargetId = "assignMultipleSelectionScrollableDialog";

const formSchema = z.object({
  selectedIds: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export function AssignMultipleSelectionDialog<T extends Node>({
  confirmButtonState,
  items,
  hasMore,
  loading,
  open,
  labels,
  onClose,
  onFetch,
  onFetchMore,
  onSubmit,
  emptyMessage,
  selectedIds,
  renderRow,
}: AssignMultipleSelectionDialogProps<T>) {
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  
  const initialSelectedIds = React.useMemo(() => {
    if (selectedIds) {
      return Object.keys(selectedIds).filter(id => selectedIds[id]);
    }

    return [];
  }, [selectedIds]);

  const { handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedIds: initialSelectedIds,
    },
  });

  const formSelectedIds = watch("selectedIds");
  const selectedItems = React.useMemo(() => {
    return items?.filter(item => formSelectedIds.includes(item.id)) || [];
  }, [formSelectedIds, items]);

  useEffect(() => {
    reset({ selectedIds: initialSelectedIds });
  }, [initialSelectedIds, reset]);

  const onFormSubmit = handleSubmit(() => {
    onSubmit(selectedItems);
  });

  const handleClose = () => {
    queryReset();
    onClose();
  };

  const handleItemToggle = (item: T, isSelected: boolean) => {
    if (isSelected) {
      setValue("selectedIds", formSelectedIds.filter(id => id !== item.id));
    } else {
      setValue("selectedIds", [...formSelectedIds, item.id]);
    }
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>

        <Box position="relative">
          <Input
            name="query"
            value={query}
            onChange={onQueryChange}
            label={labels.label}
            placeholder={labels.placeholder}
            autoComplete="off"
          />
          {loading && (
            <Box position="absolute" right={2} top={6}>
              <Spinner />
            </Box>
          )}
        </Box>

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={items?.length ?? 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <Box
            backgroundColor="default1"
            __maxHeight={400}
            overflowY="auto"
          >
            {!loading && (items?.length ?? 0) === 0 && (
              <Box padding={4}>
                <Text>{emptyMessage ?? "No objects found"}</Text>
              </Box>
            )}
            <Box>
              {items?.map((item, idx) => {
                const isSelected = formSelectedIds.includes(item.id);
                const isLastItem = idx === items.length - 1;

                return (
                  <Box
                    key={item.id}
                    data-test-id="dialog-row"
                    padding={2}
                    display="flex"
                    gap={3}
                    alignItems="center"
                    borderBottomStyle={isLastItem ? "none" : "solid"}
                    borderBottomWidth={1}
                    borderColor="default1"
                    cursor="pointer"
                    onClick={() => handleItemToggle(item, isSelected)}
                    backgroundColor={{
                      default: isSelected ? "default2" : "transparent",
                      hover: "default2",
                    }}
                    style={{ transition: "background-color 0.2s ease" }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item, isSelected)}
                      style={{ margin: 0, flexShrink: 0 }}
                    />
                    <Box display="flex" gap={3} alignItems="center" style={{ flex: 1 }}>
                      {renderRow(item)}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </InfiniteScroll>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="submit"
            transitionState={confirmButtonState}
            onClick={onFormSubmit}
          >
            {labels.confirmBtn}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
}

AssignMultipleSelectionDialog.displayName = "AssignMultipleSelectionDialog";
