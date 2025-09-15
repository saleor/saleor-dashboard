# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Saleor Dashboard is a GraphQL-powered, single-page React application built with TypeScript that serves as the admin interface for the Saleor e-commerce platform. It uses modern web technologies including React 17, @saleor/macaw-ui-next, Apollo Client, and Vite for bundling.

## Development Commands

### Basic Development

- `npm run dev` - Start development server on port 9000 with host binding
- `npm run build` - Build production bundle with 8GB memory allocation
- `npm run preview` - Preview production build locally

### Code Quality & Testing

- `npm run lint` - Run ESLint with auto-fix on src/ and playwright/ directories
- `npm run test` - Run Jest tests for src/ directory
- `npm run test:ci` - Run tests with coverage report
- `npm run check-types` - Run TypeScript type checking for both src and playwright
- `npm run check-types:src` - Type check src/ directory with strict plugin
- `npm run check-types:playwright` - Type check playwright test files

### GraphQL & Code Generation

- `npm run generate` - Generate GraphQL types and hooks from schema
- `npm run fetch-schema` - Download GraphQL schema from Saleor repository
- `npm run fetch-local-schema` - Fetch schema from local Saleor instance

### Internationalization

- `npm run extract-messages` - Extract translatable messages from TypeScript files, run it after changing messages in `react-intl`

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
3. Run `npm run generate` to generate GraphQL types
4. Install dependencies with `npm i`

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

### Testing Requirements

- Write unit tests for utility functions and complex components
- Use Playwright for E2E testing of critical user flows
- Mock GraphQL operations in tests using fixtures
- Ensure type safety with TypeScript strict plugin

Add // Arrange // Act // Assert comments in tests to clarify test structure
