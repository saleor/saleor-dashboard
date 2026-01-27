# ResponsiveTable

## Handling Loading, Empty, and Data States

When `data` can be `undefined` (loading), always handle three states explicitly:

```tsx
{
  data === undefined ? (
    <Skeleton />
  ) : data.length === 0 ? (
    <Placeholder>
      <FormattedMessage {...messages.noItemsFound} />
    </Placeholder>
  ) : (
    <ResponsiveTable>...</ResponsiveTable>
  );
}
```

## Empty State Types

- **No initial data** → render `<Placeholder>` instead of table
- **No search/filter results** → use `filteredItemsCount={0}` prop (built-in empty state inside table)
