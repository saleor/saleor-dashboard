// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import MediaTile from "@dashboard/components/MediaTile";
import { type ProductMediaFragment, ProductMediaType } from "@dashboard/graphql";
import { type ReorderAction } from "@dashboard/types";
import createMultiFileUploadHandler from "@dashboard/utils/handlers/multiFileUploadHandler";
import { Box, Button, Dropdown, List, Skeleton, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { messages } from "./messages";
import styles from "./ProductMedia.module.css";
import { ProductMediaGalleryDropzone } from "./ProductMediaGalleryDropzone";

interface SortableMediaProps {
  media: {
    id: string;
    alt?: string;
    url: string;
  };
  editHref: string;
  onDelete: () => void;
  placeholderSrc?: string | null;
  onPlaceholderUnused?: () => void;
}

const SortableMedia = SortableElement<SortableMediaProps>(
  ({ media, editHref, onDelete, placeholderSrc, onPlaceholderUnused }) => (
    <MediaTile
      media={media}
      editHref={editHref}
      onDelete={onDelete}
      placeholderSrc={placeholderSrc}
      onPlaceholderUnused={onPlaceholderUnused}
    />
  ),
);

interface MediaListContainerProps {
  className: string;
  media: ProductMediaFragment[];
  preview: ProductMediaFragment[];
  placeholders: Record<string, string>;
  onDelete: (id: string) => () => void;
  getEditHref: (id: string) => string;
  onPlaceholderUnused: (id: string) => void;
}

const MediaListContainer = SortableContainer<MediaListContainerProps>(
  ({ media, preview, placeholders, onDelete, getEditHref, onPlaceholderUnused, ...props }) => (
    <div {...props}>
      {media.map((mediaObj, index) => (
        <SortableMedia
          key={mediaObj.id}
          index={index}
          media={mediaObj}
          editHref={getEditHref(mediaObj.id)}
          onDelete={onDelete(mediaObj.id)}
          placeholderSrc={placeholders[mediaObj.id]}
          onPlaceholderUnused={() => onPlaceholderUnused(mediaObj.id)}
        />
      ))}
      {preview.map(mediaObj => (
        <MediaTile loading={true} media={mediaObj} key={mediaObj.id} />
      ))}
    </div>
  ),
);

interface ProductMediaProps {
  media: ProductMediaFragment[];
  loading?: boolean;
  getImageEditUrl: (id: string) => string;
  onImageDelete: (id: string) => () => void;
  onImageReorder?: ReorderAction;
  onImageUpload: (file: File) => any;
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

/** @deprecated This component should use @dnd-kit instead of react-sortable-hoc */
const ProductMedia = (props: ProductMediaProps) => {
  const {
    media,
    getImageEditUrl,
    onImageDelete,
    onImageReorder,
    onImageUpload,
    openMediaUrlModal,
  } = props;
  const intl = useIntl();
  const imagesUpload = React.useRef<HTMLInputElement>(null);
  const anchor = React.useRef<HTMLButtonElement>();
  const [pendingMedia, setPendingMedia] = React.useState<ProductMediaFragment[]>([]);
  const [placeholders, setPlaceholders] = React.useState<Record<string, string>>({});
  const pendingMediaRef = React.useRef(pendingMedia);
  const placeholdersRef = React.useRef(placeholders);
  const previousMediaIdsRef = React.useRef<string[] | null>(null);
  const [mediaIdsSignature, setMediaIdsSignature] = React.useState(() =>
    getMediaIdsSignature(media),
  );

  React.useEffect(
    function syncObjectUrlRefs() {
      pendingMediaRef.current = pendingMedia;
      placeholdersRef.current = placeholders;
    },
    [pendingMedia, placeholders],
  );

  // Adjust pending/placeholder state during render when saved media arrives,
  // so React re-renders before paint and never shows pending + saved tiles together.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const nextMediaIdsSignature = getMediaIdsSignature(media);

  if (nextMediaIdsSignature !== null && media && nextMediaIdsSignature !== mediaIdsSignature) {
    const currentIds = media.map(item => item.id);
    const previousIds = previousMediaIdsRef.current;
    const addedIds = previousIds === null ? [] : currentIds.filter(id => !previousIds.includes(id));

    previousMediaIdsRef.current = currentIds;
    setMediaIdsSignature(nextMediaIdsSignature);

    if (addedIds.length > 0 && pendingMedia.length > 0) {
      const removeCount = Math.min(addedIds.length, pendingMedia.length);
      const handedOff = pendingMedia.slice(0, removeCount);
      const nextPlaceholders = { ...placeholders };

      handedOff.forEach((item, index) => {
        nextPlaceholders[addedIds[index]] = item.url;
      });

      setPlaceholders(nextPlaceholders);
      setPendingMedia(pendingMedia.slice(removeCount));
    }
  } else if (nextMediaIdsSignature !== null && media && previousMediaIdsRef.current === null) {
    previousMediaIdsRef.current = media.map(item => item.id);
    setMediaIdsSignature(nextMediaIdsSignature);
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

  const handleImageUpload = React.useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (fileArray.length === 0) {
        return;
      }

      const pendingItems = fileArray.map((file, fileIndex) => createPendingMedia(file, fileIndex));
      const clientIds = pendingItems.map(item => item.id);

      setPendingMedia(prev => [...prev, ...pendingItems]);

      return createMultiFileUploadHandler(onImageUpload, {
        onError: index => removePendingMedia(clientIds[index]),
      })(fileArray);
    },
    [onImageUpload, removePendingMedia],
  );

  const showGallery = (media?.length ?? 0) > 0 || pendingMedia.length > 0;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.media} />
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
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
                <MediaListContainer
                  distance={20}
                  helperClass="dragged"
                  axis="xy"
                  media={media ?? []}
                  preview={pendingMedia}
                  placeholders={placeholders}
                  onSortEnd={onImageReorder}
                  className={clsx(styles.mediaList, isDragActive && styles.mediaListDimmed)}
                  onDelete={onImageDelete}
                  getEditHref={getImageEditUrl}
                  onPlaceholderUnused={handlePlaceholderUnused}
                />
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
