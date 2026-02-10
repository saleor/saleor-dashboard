// @storybook/react-vite uses package.json "exports" which requires
// moduleResolution "node16", "nodenext", or "bundler".
// This project uses "node" resolution, so we declare the module manually.
declare module "@storybook/react-vite" {
  export { Decorator, Meta, StoryFn, StoryObj } from "@storybook/react/dist/index";
}
