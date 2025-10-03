import { getAbsoluteApiUrl } from "@dashboard/config";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";

const createInputElement = (name: string, value: string): HTMLInputElement => {
  const elInput = document.createElement("input");

  elInput.type = "hidden";
  elInput.name = name;
  elInput.value = value;

  return elInput;
};

export const prepareFormValues = (
  paramsRecord: Record<string, string | string[] | undefined | null>,
) => {
  const entries = Object.entries(paramsRecord);

  return entries.reduce(
    (acc, [rootKey, rootValue]) => {
      if (typeof rootValue === "string") {
        acc.push([rootKey, rootValue]);

        return acc;
      }

      if (Array.isArray(rootValue)) {
        rootValue.forEach(value => {
          if (typeof value === "string") {
            acc.push([rootKey, value]);
          }
        });

        return acc;
      }

      return acc;
    },
    [] as [string, string][],
  );
};

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
      saleorApiUrl: getAbsoluteApiUrl(),
    };

    const form = document.createElement("form");

    form.method = "POST";
    form.action = args.extensionUrl;
    form.target = "_blank";
    form.style.display = "none";

    const valuesFlatList = prepareFormValues(formParams);

    valuesFlatList.forEach(([inputName, inputValue]) => {
      form.appendChild(createInputElement(inputName, inputValue));
    });

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
