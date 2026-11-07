export const topBarHeight = "77px";
export const topBarHeightSubtitle = "120px";
export const appLoaderHeight = 2;
export const savebarHeight = "64px";
export const borderHeight = "1px";
/** Set by the connection banner above the page while it's mounted; 0 while it's closed. */
export const connectionBannerHeightVariable = "--connection-banner-height";
/**
 * The viewport height left for the page below what the app shows above it (the connection
 * banner). Use it instead of `100vh` in page layouts.
 */
export const pageViewportHeight = `calc(100vh - var(${connectionBannerHeightVariable}, 0px))`;
