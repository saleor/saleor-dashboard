import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { useRuleConditionsSelectedOptionsDetailsLazyQuery } from "@dashboard/graphql";

const isFormItemValid = (item: unknown): item is string => {
  return typeof item !== "string";
};

const createInputElement = (name: string, value: string): HTMLInputElement => {
  const elInput = document.createElement("input");

  elInput.type = "hidden";
  elInput.name = name;
  elInput.value = value;

  return elInput;
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
      saleorApiUrl: process.env.API_URL,
    };

    const form = document.createElement("form");

    form.method = "POST";
    form.action = args.extensionUrl;
    form.target = "_blank";
    form.style.display = "none";

    console.log(Object.entries(formParams));

    Object.entries(formParams).forEach(([paramRootKey, paramRootValue]) => {
      console.log(paramRootKey, paramRootValue);

      if (Array.isArray(paramRootValue)) {
        console.log("is array");
        console.log(paramRootValue);
        paramRootValue.forEach(paramNestedValue => {
          console.log("nested value", paramNestedValue);

          if (isFormItemValid(paramNestedValue)) {
            console.log("valid in array");
            form.appendChild(createInputElement(paramRootKey, paramNestedValue));
          }
        });
      } else {
        if (isFormItemValid(paramRootValue)) {
          form.appendChild(createInputElement(paramRootKey, paramRootValue));
        }
      }
    });

    console.log(form.length);

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
