import React, { useContext } from "react";

interface CreateVaraintContext {
  isManageChannelsModalOpen: boolean;
  toggleManageChannelsModal: () => void;
}

const CreateVariantContext = React.createContext<CreateVaraintContext>(null);

export const CreateVariantContextProvider = CreateVariantContext.Provider;

export const useVariantChannels = () => {
  const createVariantContext = useContext(CreateVariantContext);

  if (!createVariantContext) {
    throw Error("CreateVariantContext must be wrapped by its Provider.");
  }

  return createVariantContext;
};
