# Metadata Modal Migration

Move inline `<Metadata>` cards to `TopNav.MetadataButton` + entity-specific dialog.

## Before (legacy)

```tsx
// Page content
<Metadata data={data} onChange={handlers.changeMetadata} />;

// View submit
const handleSubmit = createMetadataUpdateHandler(
  entity,
  handleUpdate,
  updateMetadata,
  updatePrivateMetadata,
);
```

## After (edit view)

```tsx
// TopNav
<TopNav.MetadataButton
  onClick={onShowMetadata}
  disabled={!entity}
  data-test-id="show-entity-metadata"
  title={intl.formatMessage(messages.editEntityMetadata)}
/>

// View — metadata saved independently
<EntityMetadataDialog open={params.action === "view-metadata" && !!entity} onClose={closeModal} entity={entity} />
onSubmit={handleUpdate} // no createMetadataUpdateHandler
```

## Create vs edit

| Flow   | Metadata UI                         | Submit                                                             |
| ------ | ----------------------------------- | ------------------------------------------------------------------ |
| Create | Inline `<Metadata>` in page content | `createMetadataCreateHandler` after entity mutation                |
| Edit   | `TopNav.MetadataButton` + dialog    | Entity update mutation only; dialog uses `useHandleMetadataSubmit` |

## Form changes (shared create/edit forms)

Skip metadata in update submit:

```tsx
const getSubmitData = async () => ({
  ...data,
  ...(pageExists ? {} : getMetadata(formData, isMetadataModified, isPrivateMetadataModified)),
  // ...
});
```

## Test

Mirror `WarehouseMetadataDialog.test.tsx`: mock `useHandleMetadataSubmit`, assert title, close, expanded metadata values.
