import { type ComponentType, lazy, type LazyExoticComponent } from "react";

/*
  Saleor Cloud features live in the private saleor/dashboard-cloud-extensions repository, checked
  out as a git submodule at ./src (see README.md). Without it, the glob matches nothing and every
  export here renders nothing.
*/

/** @public What the default export of ./src/index.ts must provide. */
export interface CloudExtensions {
  EnvironmentSwitcher: ComponentType;
}

const [loadExtensions] = Object.values(
  import.meta.glob<CloudExtensions>("./src/index.ts", { import: "default" }),
);

const RenderNothing = (): null => null;

const lazyExtension = (name: keyof CloudExtensions): LazyExoticComponent<ComponentType> =>
  lazy(async () => ({ default: (await loadExtensions?.())?.[name] ?? RenderNothing }));

export const EnvironmentSwitcher = lazyExtension("EnvironmentSwitcher");
