import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { type MetadataIdSchema } from "@dashboard/components/Metadata";
import { type OrderDetailsQueryResult } from "@dashboard/graphql";
import {
  type CloseModalFunction,
  type OpenModalFunction,
} from "@dashboard/utils/handlers/dialogActionHandlers";

import { type OrderUrlDialog, type OrderUrlQueryParams } from "../../urls";
import { type OrderOperationHandlers } from "./operations/handlers";

/**
 * Route context handed to each non-draft concrete view. The view instantiates
 * its own operation hooks from `handlers` and forwards their results to the
 * shared lifecycle views, so this no longer carries the mutation bundle.
 */
export interface NonDraftOrderDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  data: OrderDetailsQueryResult["data"];
  loading: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  handleSubmit: (data: MetadataIdSchema) => Promise<unknown[]>;
  openModal: OpenModalFunction<OrderUrlDialog, OrderUrlQueryParams>;
  closeModal: CloseModalFunction;
  handlers: OrderOperationHandlers;
}
