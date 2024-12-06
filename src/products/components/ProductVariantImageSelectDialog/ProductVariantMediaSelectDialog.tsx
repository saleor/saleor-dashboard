import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ProductMediaFragment } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

interface ProductVariantImageSelectDialogProps {
  media?: ProductMediaFragment[];
  selectedMedia?: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

const ProductVariantMediaSelectDialog = (props: ProductVariantImageSelectDialogProps) => {
  const { media, open, selectedMedia: initialMedia, onClose, onConfirm } = props;
  const [selectedMedia, setSelectedMedia] = useState(initialMedia);

  useModalDialogOpen(open, {
    onOpen: () => setSelectedMedia(initialMedia),
    onClose: () => setSelectedMedia(initialMedia),
  });

  const handleMediaSelect = (id: string) => {
    const isMediaAssigned = selectedMedia?.includes(id);

    if (isMediaAssigned) {
      setSelectedMedia(selectedMedia => selectedMedia?.filter(mediaId => mediaId !== id));
    } else {
      setSelectedMedia(selectedMedia => [...(selectedMedia ?? []), id]);
    }
  };
  const handleConfirm = () => {
    onConfirm(selectedMedia ?? []);
    onClose();
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="md" __gridTemplateRows="auto 1fr">
        <DashboardModal.Header>
          <FormattedMessage
            id="iPk640"
            defaultMessage="Media Selection"
            description="dialog header"
          />
        </DashboardModal.Header>

        <Box
          overflowY="auto"
          display="grid"
          gap={2}
          gridTemplateColumns={{
            desktop: 4,
            tablet: 3,
            mobile: 2,
          }}
          width="100%"
        >
          {media
            ?.sort((prev, next) => (prev.sortOrder! > next.sortOrder! ? 1 : -1))
            .map(mediaObj => {
              const parsedMediaOembedData = JSON.parse(mediaObj?.oembedData);
              const mediaUrl = parsedMediaOembedData?.thumbnail_url || mediaObj.url;
              const isSelected = selectedMedia?.includes(mediaObj.id);

              return (
                <Box
                  backgroundColor="transparent"
                  borderStyle="solid"
                  __borderWidth={isSelected ? 2 : 1}
                  borderColor={isSelected ? "info1" : "default1"}
                  cursor="pointer"
                  __height={140}
                  overflow="hidden"
                  padding={3}
                  position="relative"
                  borderRadius={2}
                  onClick={() => handleMediaSelect(mediaObj.id)}
                  key={mediaObj.id}
                >
                  <Box
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    as="img"
                    src={mediaUrl}
                    alt={mediaObj.alt}
                    style={{
                      userSelect: "none",
                    }}
                  />
                </Box>
              );
            })}
        </Box>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton transitionState="default" onClick={handleConfirm} data-test-id="submit">
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ProductVariantMediaSelectDialog.displayName = "ProductVariantMediaSelectDialog";
export default ProductVariantMediaSelectDialog;
