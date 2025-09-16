# ConditionalFilter Component

**📚 For detailed implementation instructions for adding new fields or migrating to WHERE API, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**

This document provides a high-level overview of the `ConditionalFilter` system.

## Overview

`ConditionalFilter` is a flexible system for building complex filter queries in the dashboard.
It provides a user-friendly UI for selecting filter conditions and translates them into GraphQL query variables for either the legacy `filter` API or the modern `where` API.

**The system is in the process of being migrated to use the `where` API exclusively.** (some queries might not yet have `where` API in their input)

## Architecture

The system is composed of several key subsystems that work together:

`UI` -> `Value Provider (URL Sync)` -> `API Provider (Data Fetching)` -> `Query Builder (GraphQL Vars)`

1.  **UI (`<ConditionalFilters />`)**: The main React component that users interact with.
2.  **Value Provider**: Manages the synchronization between the filter state in the UI and the browser's URL.
3.  **API Provider & Handlers**: Fetch the data needed for filter options (e.g., a list of channels, categories, or statuses).
4.  **Initial State & Rehydration**: Fetches the necessary data to restore the filter's state from a URL on page load.
5.  **Query Variable Builders**: Transform the filter state into the final GraphQL query variables (`filter` or `where` objects).

### Core Concepts

- **`FilterElement`**: The atomic unit of a filter, representing a single condition (e.g., "Status is PAID"). It holds the field, the operator, and the value.

- **`FilterContainer`**: An array structure that holds multiple `FilterElement` objects. It represents the complete set of active filters, joined by `AND`.

- **Data Flow**: The system follows a clear data flow from user interaction to GraphQL query:
  ```
  User Input → FilterElement → URL Parameters → GraphQL Variables
       ↓            ↓              ↓                ↓
    UI State → Container State → TokenArray → Query Builder
  ```

## How to Add a New Filter Field

**Read full details in `IMPLEMENTATION_GUIDE.md`**. Read it sequentially based on what step are you working on. It also includes debugging tips.

## Common Issues When Adding/Modifying Filters

When working with the ConditionalFilter system, especially during API migrations (like legacy FILTER → WHERE API), pay attention to these common issues:

### 1. Field Name Mapping Issues

- **Problem**: UI field names don't always match GraphQL schema field names
- **Example**: The `customer` filter UI field maps to `user` in OrderWhereInput, not `userEmail` or `customer`
- **Solution**: Check the GraphQL schema and ensure proper mapping in `StaticQueryVarsBuilder.mapFieldNameToGraphQL()`
- **Files to check**:
  - `FiltersQueryBuilder/queryVarsBuilders/StaticQueryVarsBuilder.ts` (line ~88-95)
  - GraphQL schema for the correct field names
  - Test files for expected field mappings

### 2. Interface Inconsistency During API Migration

- **Problem**: Old field names remain in TypeScript interfaces but are removed from the GraphQL schema
- **Example**: `paymentStatus` was removed from WHERE API but remained in `OrderFetchingParams`
- **Solution**: Remove deprecated fields from all interfaces and clean up references
- **Files to check**:
  - `ValueProvider/TokenArray/fetchingParams.ts` - Interface definitions
  - `ValueProvider/UrlToken.ts` - STATIC arrays (ORDER_STATICS, etc.)
  - `API/initialState/*/use*State.ts` - Initial state hooks
  - Remove unused parameters from function signatures

### 3. Parameter Assignment Bugs

- **Problem**: Copy-paste errors when handling similar enum fields
- **Example**: `chargeStatus` parameter incorrectly assigned to `paymentStatus` in EnumValuesHandler
- **Solution**: Carefully verify parameter assignments match their intended fields
- **Files to check**:
  - `API/initialState/*/use*State.ts` - Parameter destructuring and handler initialization
  - Ensure field names match between destructuring and handler usage

### 4. Test Expectations vs Implementation

- **Problem**: Tests expect certain field mappings that don't match the current implementation
- **Example**: Tests expecting `user` field but code producing `userEmail`
- **Solution**: Verify tests match the GraphQL schema requirements, not legacy expectations
- **Files to check**:
  - `*/views/*/filters.test.ts` - Filter variable expectations
  - Compare test expectations with actual GraphQL schema

### 5. Missing Field Registration

- **Problem**: New filters work in code but don't appear in URL or don't rehydrate properly
- **Solution**: Ensure fields are registered in all necessary places
- **Files to check**:
  - `constants.ts` - STATIC\_\*\_OPTIONS arrays
  - `ValueProvider/UrlToken.ts` - \*\_STATICS arrays
  - Query builder registration in domain-specific query variable functions

### Quick Checklist for Filter Changes

When modifying filters, verify these files are consistent:

1. **Interface definitions** - Remove deprecated fields entirely
2. **GraphQL mapping** - Ensure UI field names map to correct schema fields
3. **URL token handling** - Update static field arrays
4. **Initial state** - Remove unused parameters and fix assignments
5. **Tests** - Update expectations to match GraphQL schema
6. **Query builders** - Handle field transformations correctly

## Subsystem Documentation

For more detailed information on each part of the system, please refer to the specialized documentation:

- **[Query Variable Builders](./FiltersQueryBuilder/queryVarsBuilders/DOCS.md)**: For transforming filter state into GraphQL variables.
- **[API Providers & Handlers](./API/DOCS.md)**: For fetching data for filter options.
- **[Initial State & Rehydration](./API/initialState/DOCS.md)**: For restoring filter state from a URL.
- **[Value Provider & URL Sync](./ValueProvider/DOCS.md)**: For synchronizing state with the URL.
