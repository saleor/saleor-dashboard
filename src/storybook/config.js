/* eslint-disable */
import { configure } from "@storybook/react";
import requireContext from "require-context.macro";

window.__SALEOR_CONFIG__ = {
  APP_MOUNT_URI: "/",
  MARKETPLACE_URL: "",
};

const req = requireContext("../", true, /.stories.tsx$/);

function loadStories() {
  // Story autodiscovery
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
