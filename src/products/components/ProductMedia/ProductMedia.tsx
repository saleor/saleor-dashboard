// @ts-strict-ignore
import { type FetchResult } from "@apollo/client";
import { DashboardCard } from "@dashboard/components/Card";
import { Draggable } from "@dashboard/components/Draggable/Draggable";
import MediaTile from "@dashboard/components/MediaTile";
import {
  type ProductMediaCreateMutation,
  type ProductMediaFragment,
  ProductMediaType,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { type ReorderAction } from "@dashboard/types";
import createMultiFileUploadHandler from "@dashboard/utils/handlers/multiFileUploadHandler";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Box, Button, Dropdown, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./ProductMedia.module.css";
import { ProductMediaGalleryDropzone } from "./ProductMediaGalleryDropzone";
import { useProductMediaDrag } from "./useProductMediaDrag";
import {
  PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES,
  validateProductMediaFiles,
} from "./validateProductMediaFiles";

const UPLOAD_CONCURRENCY = 3;

/**
 * Flex-wrap galleries cannot use rectSortingStrategy — transforms fight the reflow
 * and animate items in from the left on drop. Same approach as SortableChipsField.
 * @see https://github.com/clauderic/dnd-kit/issues/44#issuecomment-757312037
 */
function disableSortingStrategy() {
  return null;
}

interface MediaListProps {
  className: string;
  media: ProductMediaFragment[];
  preview: ProductMediaFragment[];
  placeholders: Record<string, string>;
  selectedIds: Set<string>;
  disabled?: boolean;
  onDelete: (id: string) => () => void;
  onSelectionChange: (id: string, selected: boolean) => void;
  getEditHref: (id: string) => string;
  onPlaceholderUnused: (id: string) => void;
}

const MediaList = ({
  className,
  media,
  preview,
  placeholders,
  selectedIds,
  disabled = false,
  onDelete,
  onSelectionChange,
  getEditHref,
  onPlaceholderUnused,
}: MediaListProps) => (
  <div className={className}>
    {media.map(mediaObj => (
      <Draggable key={mediaObj.id} id={mediaObj.id} disabled={disabled}>
        {({ ref, style, isDragging, ...draggableProps }) => (
          <div
            ref={ref}
            // Park the ghost in the list slot; DragOverlay follows the pointer above siblings
            style={isDragging ? { ...style, transform: undefined, transition: undefined } : style}
            className={clsx(styles.sortableTile, isDragging && styles.sortableTilePlaceholder)}
            {...draggableProps}
          >
            <MediaTile
              media={mediaObj}
              editHref={getEditHref(mediaObj.id)}
              onDelete={onDelete(mediaObj.id)}
              selected={selectedIds.has(mediaObj.id)}
              onSelectionChange={selected => onSelectionChange(mediaObj.id, selected)}
              placeholderSrc={placeholders[mediaObj.id]}
              onPlaceholderUnused={() => onPlaceholderUnused(mediaObj.id)}
              disableOverlay={isDragging}
            />
          </div>
        )}
      </Draggable>
    ))}
    {preview.map(mediaObj => (
      <MediaTile loading={true} media={mediaObj} key={mediaObj.id} />
    ))}
  </div>
);

interface ProductMediaProps {
  media: ProductMediaFragment[];
  loading?: boolean;
  getImageEditUrl: (id: string) => string;
  onImageDelete: (id: string) => () => void;
  onImagesDelete: (ids: string[]) => void;
  onImageReorder?: ReorderAction;
  onImageUpload: (file: File) => Promise<FetchResult<ProductMediaCreateMutation>>;
  onImagesUploadComplete?: (result: { successCount: number; failureCount: number }) => void;
  openMediaUrlModal: () => any;
}

let pendingMediaIdCounter = 0;

const createPendingMediaId = () => {
  pendingMediaIdCounter += 1;

  return `pending-${Date.now()}-${pendingMediaIdCounter}`;
};

const createPendingMedia = (file: File, sortOrder: number): ProductMediaFragment => {
  const clientId = createPendingMediaId();

  return {
    __typename: "ProductMedia",
    alt: "",
    id: clientId,
    sortOrder,
    type: ProductMediaType.IMAGE,
    url: URL.createObjectURL(file),
    oembedData: null,
  };
};

const revokeObjectUrl = (url: string) => {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const getMediaIdsSignature = (media: ProductMediaFragment[] | undefined) =>
  media === undefined ? null : media.map(item => item.id).join("\0");

const ProductMedia = (props: ProductMediaProps) => {
  const {
    media,
    getImageEditUrl,
    onImageDelete,
    onImagesDelete,
    onImageReorder,
    onImageUpload,
    onImagesUploadComplete,
    openMediaUrlModal,
  } = props;
  const intl = useIntl();
  const notify = useNotifier();
  const imagesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLButtonElement>();
  const [pendingMedia, setPendingMedia] = React.useState<ProductMediaFragment[]>([]);
  const [placeholders, setPlaceholders] = React.useState<Record<string, string>>({});
  /** Maps pending client ids to server media ids once each upload mutation returns. */
  const [pendingHandoffs, setPendingHandoffs] = React.useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  const pendingMediaRef = React.useRef(pendingMedia);
  const placeholdersRef = React.useRef(placeholders);
  const [mediaIdsSignature, setMediaIdsSignature] = React.useState(() =>
    getMediaIdsSignature(media),
  );

  const isUploading = pendingMedia.length > 0;
  const {
    orderedMedia,
    activeMedia,
    items,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useProductMediaDrag({
    media: media ?? [],
    onReorder: onImageReorder,
    disabled: isUploading,
  });

  React.useEffect(
    function syncObjectUrlRefs() {
      pendingMediaRef.current = pendingMedia;
      placeholdersRef.current = placeholders;
    },
    [pendingMedia, placeholders],
  );

  // Adjust pending/placeholder/selection when saved media arrives or handoffs resolve.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const nextMediaIdsSignature = getMediaIdsSignature(media);
  const currentIds = media?.map(item => item.id) ?? [];
  const mediaIdsChanged =
    nextMediaIdsSignature !== null && media && nextMediaIdsSignature !== mediaIdsSignature;

  if (mediaIdsChanged) {
    setMediaIdsSignature(nextMediaIdsSignature);

    setSelectedIds(prev => {
      const next = new Set([...prev].filter(id => currentIds.includes(id)));

      return next.size === prev.size ? prev : next;
    });
  }

  let nextPendingMedia = pendingMedia;
  let nextPlaceholders = placeholders;
  let nextPendingHandoffs = pendingHandoffs;
  let pendingStateChanged = false;

  // ID-based handoff (parallel-safe): pending client id → server id from mutation result
  const readyHandoffs = nextPendingMedia
    .map(item => ({
      pending: item,
      serverId: nextPendingHandoffs[item.id],
    }))
    .filter(
      (entry): entry is { pending: ProductMediaFragment; serverId: string } =>
        Boolean(entry.serverId) && currentIds.includes(entry.serverId),
    );

  if (readyHandoffs.length > 0) {
    const handedOffClientIds = new Set<string>();

    nextPlaceholders = { ...nextPlaceholders };
    readyHandoffs.forEach(({ pending, serverId }) => {
      nextPlaceholders[serverId] = pending.url;
      handedOffClientIds.add(pending.id);
    });
    nextPendingMedia = nextPendingMedia.filter(item => !handedOffClientIds.has(item.id));
    nextPendingHandoffs = { ...nextPendingHandoffs };
    handedOffClientIds.forEach(clientId => {
      delete nextPendingHandoffs[clientId];
    });
    pendingStateChanged = true;
  }

  // FIFO fallback for uploads that did not return productMediaCreate.media.id
  if (mediaIdsChanged) {
    const previousSignatureIds =
      mediaIdsSignature === null || mediaIdsSignature === ""
        ? []
        : mediaIdsSignature.split("\0").filter(Boolean);
    const addedIds = currentIds.filter(id => !previousSignatureIds.includes(id));
    const unmappedPending = nextPendingMedia.filter(item => !nextPendingHandoffs[item.id]);

    if (addedIds.length > 0 && unmappedPending.length > 0) {
      const removeCount = Math.min(addedIds.length, unmappedPending.length);
      const handedOff = unmappedPending.slice(0, removeCount);
      const handedOffClientIds = new Set(handedOff.map(item => item.id));

      nextPlaceholders = { ...nextPlaceholders };
      handedOff.forEach((item, index) => {
        nextPlaceholders[addedIds[index]] = item.url;
      });
      nextPendingMedia = nextPendingMedia.filter(item => !handedOffClientIds.has(item.id));
      pendingStateChanged = true;
    }
  }

  if (pendingStateChanged) {
    setPlaceholders(nextPlaceholders);
    setPendingMedia(nextPendingMedia);
    setPendingHandoffs(nextPendingHandoffs);
  }

  React.useEffect(function revokeObjectUrlsOnUnmount() {
    return function revokeObjectUrls() {
      pendingMediaRef.current.forEach(item => revokeObjectUrl(item.url));
      Object.values(placeholdersRef.current).forEach(revokeObjectUrl);
    };
  }, []);

  const removePendingMedia = React.useCallback((clientId: string) => {
    setPendingMedia(prev => {
      const item = prev.find(mediaItem => mediaItem.id === clientId);

      if (item) {
        revokeObjectUrl(item.url);
      }

      return prev.filter(mediaItem => mediaItem.id !== clientId);
    });
    setPendingHandoffs(prev => {
      if (!(clientId in prev)) {
        return prev;
      }

      const { [clientId]: _, ...rest } = prev;

      return rest;
    });
  }, []);

  const handlePlaceholderUnused = React.useCallback((mediaId: string) => {
    setPlaceholders(prev => {
      const url = prev[mediaId];

      if (!url) {
        return prev;
      }

      revokeObjectUrl(url);

      const { [mediaId]: _, ...rest } = prev;

      return rest;
    });
  }, []);

  const handleSelectionChange = React.useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);

      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }, []);

  const handleSelectAll = React.useCallback(() => {
    setSelectedIds(new Set((media ?? []).map(item => item.id)));
  }, [media]);

  const handleClearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleDeleteSelected = React.useCallback(() => {
    if (selectedIds.size === 0) {
      return;
    }

    onImagesDelete([...selectedIds]);
  }, [onImagesDelete, selectedIds]);

  const handleImageUpload = React.useCallback(
    (files: FileList | File[]) => {
      const { validFiles, rejected } = validateProductMediaFiles(files);

      if (rejected.length > 0) {
        notify({
          status: "warning",
          text: intl.formatMessage(messages.uploadRejected, {
            count: rejected.length,
            maxSize: Math.round(PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES / (1024 * 1024)),
          }),
        });
      }

      if (validFiles.length === 0) {
        return;
      }

      const pendingItems = validFiles.map((file, fileIndex) => createPendingMedia(file, fileIndex));
      const clientIds = pendingItems.map(item => item.id);
      let successCount = 0;
      let failureCount = 0;

      setPendingMedia(prev => [...prev, ...pendingItems]);

      return createMultiFileUploadHandler(onImageUpload, {
        concurrency: UPLOAD_CONCURRENCY,
        onAfterUpload: (index, _files, result) => {
          successCount += 1;

          const serverId = result.data?.productMediaCreate?.media?.id;

          if (serverId) {
            setPendingHandoffs(prev => ({
              ...prev,
              [clientIds[index]]: serverId,
            }));
          }
        },
        onError: index => {
          failureCount += 1;
          removePendingMedia(clientIds[index]);
        },
        onCompleted: () => {
          onImagesUploadComplete?.({ successCount, failureCount });
        },
      })(validFiles);
    },
    [intl, notify, onImageUpload, onImagesUploadComplete, removePendingMedia],
  );

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;
  const allSelected = (media?.length ?? 0) > 0 && selectedCount === media.length;
  const showGallery = (media?.length ?? 0) > 0 || pendingMedia.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.media} />
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Box display="flex" gap={2} alignItems="center">
            {hasSelection ? (
              <>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={allSelected ? handleClearSelection : handleSelectAll}
                  data-test-id="product-media-select-all"
                >
                  {intl.formatMessage(allSelected ? messages.clearSelection : messages.selectAll)}
                </Button>
                <Button
                  variant="error"
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={isUploading}
                  data-test-id="product-media-delete-selected"
                >
                  {intl.formatMessage(messages.deleteSelected, { quantity: selectedCount })}
                </Button>
              </>
            ) : null}
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  variant="secondary"
                  type="button"
                  data-test-id="button-upload-image"
                  ref={anchor}
                >
                  {intl.formatMessage(messages.upload)}
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <List
                  padding={2}
                  borderRadius={4}
                  boxShadow="defaultOverlay"
                  backgroundColor="default1"
                >
                  <Dropdown.Item>
                    <List.Item
                      borderRadius={4}
                      paddingX={1.5}
                      paddingY={2}
                      onClick={() => imagesUpload.current.click()}
                      data-test-id="upload-images"
                    >
                      <Text>{intl.formatMessage(messages.uploadImages)}</Text>
                    </List.Item>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <List.Item
                      borderRadius={4}
                      paddingX={1.5}
                      paddingY={2}
                      onClick={openMediaUrlModal}
                      data-test-id="upload-media-url"
                    >
                      <Text>{intl.formatMessage(messages.uploadUrl)}</Text>
                    </List.Item>
                  </Dropdown.Item>
                </List>
              </Dropdown.Content>
            </Dropdown>
          </Box>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <input
          className={styles.hiddenInput}
          data-test-id="product-media-file-input"
          id="product-media-file-upload"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
              handleImageUpload(event.target.files);
            }

            // Allow selecting the same file again
            event.target.value = "";
          }}
          multiple
          type="file"
          ref={imagesUpload}
          accept="image/*"
        />
        <Box position="relative">
          {media === undefined ? (
            <Box padding={5}>
              <Skeleton />
            </Box>
          ) : showGallery ? (
            <ProductMediaGalleryDropzone
              variant="gallery"
              disableClick={true}
              onImageUpload={handleImageUpload}
            >
              {({ isDragActive }) => (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext items={items} strategy={disableSortingStrategy}>
                    <MediaList
                      media={orderedMedia}
                      preview={pendingMedia}
                      placeholders={placeholders}
                      selectedIds={selectedIds}
                      disabled={isUploading}
                      className={clsx(styles.mediaList, isDragActive && styles.mediaListDimmed)}
                      onDelete={onImageDelete}
                      onSelectionChange={handleSelectionChange}
                      getEditHref={getImageEditUrl}
                      onPlaceholderUnused={handlePlaceholderUnused}
                    />
                  </SortableContext>
                  {createPortal(
                    <DragOverlay dropAnimation={null} style={{ zIndex: 1000 }}>
                      {activeMedia ? (
                        <div className={styles.dragOverlayTile}>
                          <MediaTile media={activeMedia} disableOverlay />
                        </div>
                      ) : null}
                    </DragOverlay>,
                    document.body,
                  )}
                </DndContext>
              )}
            </ProductMediaGalleryDropzone>
          ) : (
            <ProductMediaGalleryDropzone variant="empty" onImageUpload={handleImageUpload} />
          )}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductMedia.displayName = "ProductMedia";
export default ProductMedia;
