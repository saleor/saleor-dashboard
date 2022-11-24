document.getElementById = () => document.createElement("div");

window.__SALEOR_CONFIG__ = {
  API_URL: "http://localhost:8000/graphql/",
  APP_MOUNT_URI: "/",
  MARKETPLACE_URL: "http//localhost:3000",
  SALEOR_APPS_PAGE_PATH: "/saleor-apps",
  SALEOR_APPS_JSON_PATH: "/api/saleor-apps",
  APP_TEMPLATE_GALLERY_PATH: "/template-gallery",
};
