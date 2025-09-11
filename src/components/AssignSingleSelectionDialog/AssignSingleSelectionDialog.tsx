import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { DialogProps, FetchMoreProps, Node } from "@dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Input, RadioGroup, Spinner, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BackButton from "../BackButton";

export interface AssignSingleSelectionDialogProps<T extends Node> extends FetchMoreProps, DialogProps {
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
  selectedId?: string;
  renderItem: (item: T, isSelected: boolean, isLastItem: boolean) => React.ReactNode;
}

const scrollableTargetId = "assignSingleSelectionScrollableDialog";

const formSchema = z.object({
  selectedId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AssignSingleSelectionDialog<T extends Node>({
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
  selectedId,
  renderItem,
}: AssignSingleSelectionDialogProps<T>) {
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  
  const { handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedId: selectedId,
    },
  });

  const formSelectedId = watch("selectedId");
  const selectedItem = React.useMemo(() => {
    return formSelectedId ? items?.find(item => item.id === formSelectedId) || null : null;
  }, [formSelectedId, items]);

  React.useEffect(() => {
    reset({ selectedId: selectedId });
  }, [selectedId, reset]);

  const onFormSubmit = handleSubmit(() => {
    onSubmit(selectedItem ? [selectedItem] : []);
  });

  const handleClose = () => {
    queryReset();
    onClose();
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
            borderRadius={4}
            boxShadow="defaultOverlay"
            backgroundColor="default1"
            __maxHeight={400}
            overflowY="auto"
          >
            {!loading && (items?.length ?? 0) === 0 && (
              <Box padding={4}>
                <Text>{emptyMessage ?? "No objects found"}</Text>
              </Box>
            )}
            <RadioGroup
              value={formSelectedId || ""}
              onValueChange={(value) => {
                setValue("selectedId", value);
              }}
            >
              <Box>
                {items?.map((item, idx) => {
                  const isSelected = selectedItem?.id === item.id;
                  const isLastItem = idx === items.length - 1;

                  return (
                    <Box
                      key={item.id}
                      data-test-id="dialog-row"
                      padding={2}
                      display="flex"
                      gap={3}
                      alignItems="center"
                      as="label"
                      borderBottomStyle={isLastItem ? "none" : "solid"}
                      borderBottomWidth={1}
                      borderColor="default1"
                      cursor="pointer"
                      backgroundColor={{
                        default: isSelected ? "accent1" : "transparent",
                        hover: isSelected ? "accent1Hovered" : "default1Hovered",
                      }}
                    >
                      <RadioGroup.Item
                        id={item.id}
                        value={item.id}
                        style={{ margin: 0, flexShrink: 0 }}
                      >
                        <span />
                      </RadioGroup.Item>
                      <Box display="flex" gap={3} alignItems="center" style={{ flex: 1 }}>
                        {renderItem(item, isSelected, isLastItem)}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </RadioGroup>
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

AssignSingleSelectionDialog.displayName = "AssignSingleSelectionDialog";
