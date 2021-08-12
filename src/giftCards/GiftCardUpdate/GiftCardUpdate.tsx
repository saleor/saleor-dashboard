import React from "react";

import GiftCardUpdatePage from "./GiftCardUpdatePage";
import GiftCardDetailsProvider from "./providers/GiftCardDetailsProvider";
import GiftCardUpdateDialogsProvider from "./providers/GiftCardUpdateDialogsProvider";
import GiftCardUpdateFormProvider from "./providers/GiftCardUpdateFormProvider/GiftCardUpdateFormProvider";
import { GiftCardUpdatePageUrlQueryParams } from "./types";

interface GiftCardUpdateProps {
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

const GiftCardUpdate: React.FC<GiftCardUpdateProps> = ({ id, params }) => (
  <GiftCardUpdateDialogsProvider id={id} params={params}>
    <GiftCardDetailsProvider id={id}>
      <GiftCardUpdateFormProvider>
        <GiftCardUpdatePage />
      </GiftCardUpdateFormProvider>
    </GiftCardDetailsProvider>
  </GiftCardUpdateDialogsProvider>
);

export default GiftCardUpdate;
