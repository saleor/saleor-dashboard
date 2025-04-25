// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ImageUpload from "@dashboard/components/ImageUpload";
import MediaTile from "@dashboard/components/MediaTile";
import { ProductMediaFragment, ProductMediaType } from "@dashboard/graphql";
import { ReorderAction } from "@dashboard/types";
import createMultiFileUploadHandler from "@dashboard/utils/handlers/multiFileUploadHandler";
import { Box, Button, Dropdown, List, Skeleton, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { messages } from "./messages";

interface SortableMediaProps {
  media: {
    id: string;
    alt?: string;
    url: string;
  };
  editHref: string;
  onDelete: () => void;
}

const SortableMedia = SortableElement<SortableMediaProps>(({ media, editHref, onDelete }) => (
  <MediaTile media={media} editHref={editHref} onDelete={onDelete} />
));

interface MediaListContainerProps {
  className: string;
  media: ProductMediaFragment[];
  preview: ProductMediaFragment[];
  onDelete: (id: string) => () => void;
  getEditHref: (id: string) => string;
}

const MediaListContainer = SortableContainer<MediaListContainerProps>(
  ({ media, preview, onDelete, getEditHref, ...props }) => (
    <div {...props}>
      {media.map((mediaObj, index) => (
        <SortableMedia
          key={`item-${index}`}
          index={index}
          media={mediaObj}
          editHref={getEditHref(mediaObj.id)}
          onDelete={onDelete(mediaObj.id)}
        />
      ))}
      {preview
        .sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1))
        .map((mediaObj, index) => (
          <MediaTile loading={true} media={mediaObj} key={index} />
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

const ProductMedia: React.FC<ProductMediaProps> = props => {
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
  const [imagesToUpload, setImagesToUpload] = React.useState<ProductMediaFragment[]>([]);
  const handleImageUpload = createMultiFileUploadHandler(onImageUpload, {
    onAfterUpload: () => setImagesToUpload(prevImagesToUpload => prevImagesToUpload.slice(1)),
    onStart: files => {
      Array.from(files).forEach((file, fileIndex) => {
        const reader = new FileReader();

        reader.onload = event => {
          setImagesToUpload(prevImagesToUpload => [
            ...prevImagesToUpload,
            {
              __typename: "ProductMedia",
              alt: "",
              id: "",
              sortOrder: fileIndex,
              type: ProductMediaType.IMAGE,
              url: event.target.result as string,
              oembedData: null,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
  });

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
        <Box>
          <Box
            as="input"
            display="none"
            id="fileUpload"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleImageUpload(event.target.files)
            }
            multiple
            type="file"
            ref={imagesUpload}
            accept="image/*"
          />
        </Box>
        <Box position="relative">
          {media === undefined ? (
            <Box padding={5}>
              <Skeleton />
            </Box>
          ) : media.length > 0 ? (
            <>
              <ImageUpload
                className={sprinkles({
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                })}
                isActiveClassName={sprinkles({ zIndex: "1" })}
                disableClick={true}
                hideUploadIcon={true}
                iconContainerActiveClassName={sprinkles({ display: "block" })}
                onImageUpload={handleImageUpload}
              >
                {({ isDragActive }) => (
                  <MediaListContainer
                    distance={20}
                    helperClass="dragged"
                    axis="xy"
                    media={media}
                    preview={imagesToUpload}
                    onSortEnd={onImageReorder}
                    className={sprinkles({
                      display: "flex",
                      gap: 5,
                      flexWrap: "wrap",
                      opacity: isDragActive ? "0.2" : "1",
                    })}
                    onDelete={onImageDelete}
                    getEditHref={getImageEditUrl}
                  />
                )}
              </ImageUpload>
            </>
          ) : (
            <ImageUpload onImageUpload={handleImageUpload} />
          )}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductMedia.displayName = "ProductMedia";
export default ProductMedia;
