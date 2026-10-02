import { notificationsCustomerEmailsAppPath } from "@dashboard/notificationsSettings/urls";
import { Redirect } from "react-router-dom";

/**
 * `/notifications-settings/customer` is the old Configuration path. The
 * official way to open an app is `/extensions/app/<manifest-identifier>` —
 * the same identifier App Bridge `RedirectToApp` uses.
 */
export const CustomerEmailsRedirectView = (): React.ReactNode => {
  return <Redirect to={notificationsCustomerEmailsAppPath} />;
};
