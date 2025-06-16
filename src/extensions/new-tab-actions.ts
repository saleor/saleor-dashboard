import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";

/**
 * Manages logic that should be run when extension of target NEW_TAB is executed
 */
export const newTabActions = {
  /**
   * Creates synthetic <form> to emulate POST method
   */
  openPOSTinNewTab: (args: {
    appParams: AppDetailsUrlMountQueryParams;
    accessToken: string | null;
    appId: string;
    extensionUrl: string;
  }) => {
    const formParams = {
      ...args.appParams,
      accessToken: args.accessToken,
      appId: args.appId,
      saleorApiUrl: process.env.API_URL,
    };

    const form = document.createElement("form");

    form.method = "POST";
    form.action = args.extensionUrl;
    form.target = "_blank";
    form.style.display = "none";

    for (const [key, value] of Object.entries(formParams)) {
      if (value === undefined || value === null || typeof value !== "string") {
        continue;
      }

      const elInput = document.createElement("input");

      elInput.type = "hidden";
      elInput.name = key;
      elInput.value = value;
      form.appendChild(elInput);
    }

    document.body.append(form);

    form.submit();

    document.body.removeChild(form);
  },
  /**
   * Opens url in the new tab (emulates <a target="_blank">)
   */
  openGETinNewTab: (extensionUrl: string) => {
    window.open(extensionUrl, "_blank");
  },
};
