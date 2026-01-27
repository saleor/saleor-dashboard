# Saleor Dashboard

## Project Overview

Saleor Dashboard is a GraphQL-powered, single-page React application built with TypeScript that serves as the admin interface for the Saleor e-commerce platform. It uses modern web technologies including React 17, @saleor/macaw-ui-next, Apollo Client, and Vite for bundling.

## Development Commands

### Basic Development

- `pnpm run dev` - Start development server on port 9000 with host binding, ALWAYS run this process in background, if you can't do that ask user
- `pnpm run build` - Build production bundle
- `pnpm run preview` - Preview production build locally

### Code Quality & Testing

Before completing changes make sure you run these commands:

- `pnpm run lint` - Run ESLint with auto-fix on src/ and playwright/ directories
- `pnpm run test:quiet <file_path>` - Run specific test file with console output suppressed
- `pnpm run check-types` - Run TypeScript type checking
- `pnpm run knip` - Check for unused files/dependencies/exports

- ALWAYS run linter with autoformatter after you change the code, BEFORE you try to manually fix linter errors

#### Test Scripts

- `pnpm run test:quiet <file_path>` - RECOMMENDED: Run specific test with minimal output (--silent flag)
- `pnpm run test:debug <file_path>` - Run specific test file with full console output and extended React Testing Library output (DEBUG_PRINT_LIMIT=20000)

**Important for testing:**

- Always use `pnpm run test:quiet <file_path>` for specific files
- Use `pnpm run test:debug <file_path>` when you need to see full React component output for debugging
- Console output is suppressed in quiet command
- Tests automatically run from the `src/` directory (configured in jest.config.js)
- When writing new fixtures (e.g. any objects used as test inputs) try to figure out their types and explicitly declare them:
  `cont fixture: FixtureType = {...}`

### GraphQL & Code Generation

- `pnpm run generate` - Generate GraphQL types and hooks, after making changes in queries/mutations or updating schema
- `pnpm run fetch-schema` - Download GraphQL schema from Saleor repository
- `pnpm run fetch-local-schema` - Fetch schema from local Saleor instance

### Internationalization

- `pnpm run extract-messages` - Extract translatable messages from TypeScript files, run it after changing messages in `react-intl`

## Architecture Overview

### Module Structure

The codebase follows a feature-based architecture with shared components:

- **Feature Modules**: Each business domain (products, orders, customers, etc.) has its own directory containing:
  - `index.tsx` - Main feature export
  - `views/` - Page components and view logic
  - `components/` - Feature-specific components
  - `mutations.ts` - GraphQL mutations
  - `queries.ts` - GraphQL queries
  - `urls.ts` - Route definitions and URL helpers
  - `fixtures.ts` - Mock data for testing

- **Shared Components**: Reusable UI components in `/components/` directory organized by function
- **GraphQL Layer**: Generated types and hooks in `/graphql/` with fragment definitions in `/fragments/`
- **Services**: Business logic and utilities in `/services/` and `/utils/`

### Key Technologies

- **React 17** with TypeScript (strict mode disabled for old views using typescript-strict-plugin, new ones should use strict mode)
- **Apollo Client 3.4** for GraphQL state management
- **Vite** for build tooling and development server
- **React Hook Form** for form management
- **React Router v5** for navigation
- **React Intl** for internationalization
- **@saleor/macaw-ui-next** for UI components and design system

### TypeScript Configuration

- Base URL mapping with path aliases:
  - `@dashboard/*` → `src/*`
  - `@assets/*` → `assets/*`
  - `@locale/*` → `locale/*`
  - `@test/*` → `testUtils/*`
- Strict mode disabled but typescript-strict-plugin provides gradual strictness adoption
- ES2020 target with DOM libraries

### Build Configuration

- Vite with SWC for fast compilation and React refresh
- Source maps enabled for debugging
- Manual vendor chunk splitting for better caching
- Node polyfills for browser compatibility
- Sentry integration for error tracking in production

### Testing Setup

- Jest with SWC transformer for fast test execution
- Testing Library for React component testing
- Playwright for E2E testing
- Canvas mock and localStorage mock for browser APIs
- JSDOM test environment

## Development Workflow

### Before Starting Development

1. Ensure you have a running Saleor backend instance
2. Configure environment variables as described in `docs/configuration.md`
3. Run `pnpm run generate` to generate GraphQL types
4. Install dependencies with `pnpm i`

### Adding New Features

1. Create feature directory under appropriate domain (e.g., `/src/products/`)
2. Follow existing patterns for queries, mutations, and component structure
3. Use GraphQL fragments for consistent data fetching
4. Add proper TypeScript types and utilize path aliases
5. Include proper error handling and loading states

### Code Standards

- Use existing UI components from `/components/` directory
- Follow Material-UI theming patterns
- Utilize Apollo Client hooks for GraphQL operations
- Implement proper form validation with React Hook Form
- Add internationalization support for user-facing text

### UI Design Guidelines

**Before redesigning any component that displays a list, ask: "What happens with 50+ items?"**

If the list could be long:

- Add scrollable container with `max-height`
- Keep headers outside the scroll area
- Auto-scroll to active item on load

Other considerations:

- Loading states: Show skeletons
- Empty states: Handle zero items gracefully

### Testing Requirements

- Write unit tests for utility functions and complex components
- Use Playwright for E2E testing of critical user flows
- Mock GraphQL operations in tests using fixtures
- Ensure type safety with TypeScript strict plugin

Add // Arrange // Act // Assert comments in tests to clarify test structure

## Git Conflict Resolution

### Auto-generated Files (DO NOT manually resolve)

These files should be regenerated after resolving source conflicts:

- `pnpm-lock.yaml` - Run `pnpm install` after resolving `package.json`
- `src/graphql/hooks.generated.ts` - Run `pnpm run generate` after resolving GraphQL files
- `src/graphql/typePolicies.generated.ts` - Run `pnpm run generate` after resolving GraphQL files
- `src/graphql/fragmentTypes.generated.ts` - Run `pnpm run generate` after resolving GraphQL files
- `src/graphql/types.generated.ts` - Run `pnpm run generate` after resolving GraphQL files

### Package Version Conflicts

Always use the latest version when resolving package version conflicts between branches.

## Backend Integration

This frontend connects to a Saleor GraphQL backend:

- Default backend URL: http://localhost:8000/graphql/
- Configure via environment variables (see `docs/configuration.md`)
- Default development credentials for local Saleor instance: `admin@example.com` / `admin`
- Use `pnpm run fetch-local-schema` to sync GraphQL schema from local backend

## Package Updates

When modifying `package.json`, always run `pnpm install` to update `pnpm-lock.yaml` and node_modules.

## Contributing

### Changesets

Use changesets CLI for user-facing changes that should appear in the changelog:

**Include in changesets:**

- Features: Provide detailed description with examples/screenshots
- Enhancements: Concise description of the improvement
- Bug fixes: Describe what didn't work → what works now

**Skip changesets for:**

- Internal refactors
- Code style changes
- Test additions
- CI/CD changes
- Documentation updates (unless user-facing)

### Pull Request Guidelines

PR descriptions should:

- Provide context for reviewers to understand the changes
- Explain non-obvious decisions or trade-offs
- Focus on the "why" rather than the "what" (code shows what)
- Include screenshots for UI changes
- Reference related issues or discussions

Once opening a pull request or working with GitHub directly, prefer to use `gh` cli to execute operations

## Code review

During code review, do not verify auto-generated files. Such files are suffixed with `.generated.ts`

## React & TypeScript Guidelines

### Component Patterns

- **No default exports** - Use named exports for all components and functions
- **No `// @ts-strict-ignore`** - Write properly typed code from the start
- **Use object destructuring** - Prefer named attributes in function parameters
- **Prefer `@saleor/macaw-ui-next`** - Use the new Macaw UI library, not the legacy `@saleor/macaw-ui`
- **Use Lucide icons directly** - Macaw icons are deprecated; import from `lucide-react` instead

```typescript
// ❌ Avoid
import { IconButton } from "@saleor/macaw-ui";
import { DeleteIcon } from "@saleor/macaw-ui";

// ✅ Prefer
import { Button } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
```

### React Best Practices

- **Respect the React lifecycle** - Keep code idiomatic to React, correctly using `useEffect`, `useCallback`, `useRef`, `useMemo`
- **Proper cleanup** - Handle mounting/unmounting cycles, cancel subscriptions and async operations
- **Memoization** - Use `useCallback` for callbacks passed to children, `useMemo` for expensive computations

```typescript
// ✅ Proper useEffect with cleanup
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, [dependency]);
```

### Styling

- **Use CSS Modules** - Use `.module.css` files instead of plain `.css` files to scope styles per-import without polluting the global CSS namespace

```typescript
// ✅ CSS Modules
import styles from "./Component.module.css";
<div className={styles.container}>
```

### Internationalization

- **Reuse existing messages** - Check `src/intl.ts` and existing component messages before creating new ones
- **Use `react-intl`** - All user-facing text must be internationalized

### Module Organization

- **No index files (barrel exports)** - Use direct imports instead. Index files are an anti-pattern being removed from this codebase

```typescript
// ❌ Avoid
export { Component } from "./Component";
import { Component } from "./components";

// ✅ Prefer
import { Component } from "./components/Component";
```

### TypeScript Style

- **Prefer typed declarations over type assertions** - Annotate variable declarations rather than using `as`

```typescript
// ❌ Avoid: Type assertion bypasses type checking
const style = {
  display: "flex",
  gap: 8,
} as React.CSSProperties;

// ✅ Prefer: Typed declaration ensures type safety at assignment
const style: React.CSSProperties = {
  display: "flex",
  gap: 8,
};
```

**Why:** Type assertions (`as`) tell TypeScript to trust you and skip validation. Typed declarations validate the object shape at the point of assignment, catching errors immediately if a property is misspelled or has the wrong type.

### Component Template

```typescript
// Component.tsx
import { Box, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./Component.module.css";

interface ComponentProps {
  title: string;
  onDelete: (id: string) => void;
}

export const Component = ({ title, onDelete }: ComponentProps) => {
  const handleDelete = useCallback(() => {
    onDelete(title);
  }, [title, onDelete]);

  return (
    <Box className={styles.container}>
      <Text>{title}</Text>
      <button onClick={handleDelete}>
        <Trash2 size={16} />
        <FormattedMessage defaultMessage="Delete" id="deleteBtn" />
      </button>
    </Box>
  );
};
```
