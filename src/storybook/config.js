/* eslint-disable */
import { configure } from "@storybook/react";
import requireContext from "require-context.macro";

const req = requireContext("../", true, /.stories.tsx$/);

function loadStories() {
  // Story autodiscovery
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
