import { configure } from "@testing-library/react";

document.getElementById = () => document.createElement("div");

window.__SALEOR_CONFIG__ = {
  API_URL: "http://localhost:8000/graphql/",
  APP_MOUNT_URI: "/",
};

configure({ testIdAttribute: "data-test-id" });
