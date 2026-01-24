# ResponsiveTable Component

Styled table wrapper with optional search and pagination support.

## Basic Usage

```tsx
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";

<ResponsiveTable
  search={{
    placeholder: "Search...",
    initialValue: query,
    onSearchChange: setQuery,
  }}
  footer={
    <TablePaginationWithContext settings={settings} onUpdateListSettings={onUpdateListSettings} />
  }
  filteredItemsCount={filteredItems.length} // Shows "no results" when 0
>
  <TableHead>...</TableHead>
  <TableBody>...</TableBody>
</ResponsiveTable>;
```

## Empty States

**No initial data** - Replace the entire table with `Placeholder`:

```tsx
{
  data.length === 0 ? (
    <Placeholder>
      <FormattedMessage {...messages.noItemsFound} />
    </Placeholder>
  ) : (
    <ResponsiveTable>...</ResponsiveTable>
  );
}
```

**No results from filtering/search** - Use `filteredItemsCount={0}` (built-in "no results" state):

```tsx
<ResponsiveTable
  search={{ ... }}
  filteredItemsCount={filteredItems.length}
>
  ...
</ResponsiveTable>
```

## Guidelines

- Use `footer` prop for pagination (not `TableFooter`)
- Use `Placeholder` for no initial data; use `filteredItemsCount` for search/filter empty states
- Use `TableRowLink` for clickable rows
