import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleMetadataReferenceAssignment,
} from "@dashboard/attributes/utils/data";
import AssignAttributeValueDialog from "@dashboard/components/AssignAttributeValueDialog";
import { AttributeInput } from "@dashboard/components/Attributes";
import { useReferenceModalConsumer } from "@dashboard/products/views/ProductUpdate/state/useReferenceModalConsumer";

import { ProductUpdateHandlers } from "./types";

interface ReferenceAttributeModalProps {
  attributes: AttributeInput[];
  handlers: Pick<
    ProductUpdateHandlers,
    "selectAttributeReference" | "selectAttributeReferenceAdditionalData"
  >;
}

export const ReferenceAttributeModal = ({ attributes, handlers }: ReferenceAttributeModalProps) => {
  const { isOpen, openAttributeId, initialConstraints, searchResults, searchActions, closeModal } =
    useReferenceModalConsumer();

  const entityType = openAttributeId
    ? getReferenceAttributeEntityTypeFromAttribute(openAttributeId, attributes)
    : null;

  const attribute = openAttributeId
    ? attributes.find(({ id }) => id === openAttributeId)
    : undefined;

  if (!isOpen || !openAttributeId || !entityType || !attribute || !searchActions || !closeModal) {
    return null;
  }

  const handleSubmit = (containers: Array<{ id: string; name: string }>) => {
    const attributeValues = containers.map(container => ({
      value: container.id,
      label: container.name,
    }));

    handleMetadataReferenceAssignment(openAttributeId, attributeValues, attributes, handlers);
    closeModal();
  };

  return (
    <AssignAttributeValueDialog
      entityType={entityType}
      confirmButtonState="default"
      products={searchResults.products}
      pages={searchResults.pages}
      collections={searchResults.collections}
      categories={searchResults.categories}
      attribute={attribute}
      hasMore={searchActions.fetchMoreProducts?.hasMore ?? false}
      open={isOpen}
      onFetch={searchActions.searchProducts}
      onFetchMore={searchActions.fetchMoreProducts?.onFetchMore ?? (() => {})}
      loading={searchActions.fetchMoreProducts?.loading ?? false}
      onClose={closeModal}
      onFilterChange={searchActions.onProductFilterChange}
      initialConstraints={initialConstraints}
      onSubmit={handleSubmit}
    />
  );
};
