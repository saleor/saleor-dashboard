import { type MetadataItemFragment } from "@dashboard/graphql";

import { MetadataDialog } from "./MetadataDialog";
import { useHandleMetadataSubmit } from "./useHandleMetadataSubmit";
import { type MetadataDialogDataOptions, useMetadataDialogData } from "./useMetadataDialogData";
import { useMetadataForm } from "./useMetadataForm";
import { mapFieldArrayToMetadataInput } from "./validation";

interface EntityWithMetadata {
  id: string;
  metadata: MetadataItemFragment[];
  privateMetadata: MetadataItemFragment[];
}

type OpenLazyMetadataDialogProps<TData, TVariables, TEntity> = MetadataDialogDataOptions<
  TData,
  TVariables,
  TEntity
> & {
  title: string;
  onClose: () => void;
};

const OpenLazyMetadataDialog = <TData, TVariables, TEntity extends EntityWithMetadata>({
  title,
  onClose,
  ...dataOptions
}: OpenLazyMetadataDialogProps<TData, TVariables, TEntity>): React.ReactNode => {
  const { entity, contentLoading, loadError, onRetryLoad } = useMetadataDialogData(dataOptions);
  const { onSubmit, submitInProgress } = useHandleMetadataSubmit({
    initialData: entity,
    onClose,
    refetchDocument: dataOptions.query,
  });
  const {
    metadataFields,
    privateMetadataFields,
    metadataErrors,
    privateMetadataErrors,
    formIsDirty,
    handleChange,
    getFormData,
    baseline,
  } = useMetadataForm({ graphqlData: entity, submitInProgress });

  return (
    <MetadataDialog
      open
      onClose={onClose}
      onSave={async () => {
        await onSubmit(getFormData(), baseline);
      }}
      title={title}
      data={{
        metadata: mapFieldArrayToMetadataInput(metadataFields),
        privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
      }}
      onChange={handleChange}
      loading={submitInProgress}
      contentLoading={contentLoading}
      loadError={loadError}
      onRetryLoad={onRetryLoad}
      errors={{
        metadata: metadataErrors.length ? metadataErrors.join(", ") : undefined,
        privateMetadata: privateMetadataErrors.length
          ? privateMetadataErrors.join(", ")
          : undefined,
      }}
      formIsDirty={formIsDirty}
    />
  );
};

type LazyMetadataDialogProps<TData, TVariables, TEntity> = OpenLazyMetadataDialogProps<
  TData,
  TVariables,
  TEntity
> & {
  open: boolean;
};

/**
 * A metadata dialog for an object whose metadata the dialog loads itself: loading, load errors
 * with Retry, editing and saving. It is mounted only while open, so every open loads fresh data
 * and starts with a clean form.
 */
export const LazyMetadataDialog = <TData, TVariables, TEntity extends EntityWithMetadata>({
  open,
  ...props
}: LazyMetadataDialogProps<TData, TVariables, TEntity>): React.ReactNode =>
  open ? <OpenLazyMetadataDialog {...props} /> : null;
