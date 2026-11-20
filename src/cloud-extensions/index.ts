import { type ComponentType, lazy } from "react";

/*
  Saleor Cloud features live in the private saleor/dashboard-cloud-extensions repository, checked
  out as a git submodule at ./src (see README.md). Without it, the glob matches nothing,
  `hasCloudExtensions` is false and every export here renders nothing.
*/

/** @public What the default export of ./src/index.ts must provide. */
export interface CloudExtensions {
  /** Replaces the "Saleor Dashboard" title in the sidebar for users signed in through Saleor Cloud. */
  EnvironmentHeader: ComponentType;
  /** The whole "Snapshots and data" settings page for the current environment. */
  SnapshotsAndDataPage: ComponentType;
}

const [loadExtensions] = Object.values(
  import.meta.glob<CloudExtensions>("./src/index.ts", { import: "default" }),
);

export const hasCloudExtensions = loadExtensions !== undefined;

const RenderNothing = (): null => null;

const lazyExtension = <Props extends object>(
  pick: (extensions: CloudExtensions) => ComponentType<Props>,
) =>
  lazy(async () => {
    const extensions = await loadExtensions?.();

    return { default: extensions ? pick(extensions) : RenderNothing };
  });

export const EnvironmentHeader = lazyExtension(({ EnvironmentHeader }) => EnvironmentHeader);
export const SnapshotsAndDataPage = lazyExtension(
  ({ SnapshotsAndDataPage }) => SnapshotsAndDataPage,
);
