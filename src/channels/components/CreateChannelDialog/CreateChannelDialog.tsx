import { messages as channelFormMessages } from "@dashboard/channels/components/ChannelForm/messages";
import { CurrencyCodeCombobox } from "@dashboard/channels/components/CurrencyCodeCombobox/CurrencyCodeCombobox";
import {
  resolveCurrencyManualEditAfterChange,
  suggestCurrencyForCountry,
} from "@dashboard/channels/utils/channelCurrencyAutosuggest";
import { getSuggestedCurrencyCode } from "@dashboard/channels/utils/getSuggestedCurrencyCode";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import {
  ChannelErrorCode,
  type ChannelErrorFragment,
  type CountryFragment,
} from "@dashboard/graphql";
import { type ChangeEvent, type FormChange, type SubmitPromise } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getChannelsErrorMessage from "@dashboard/utils/errors/channels";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, DynamicCombobox, Input, type Option } from "@saleor/macaw-ui-next";
import { Globe } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import slugify from "slugify";

import { messages } from "./messages";
import { type ChannelCreateFormData } from "./types";
import { useChannelSlugAvailability } from "./useChannelSlugAvailability";
import { validateChannelCreateFormData } from "./validateChannelCreateFormData";

const createSlugTakenError = (): ChannelErrorFragment => ({
  __typename: "ChannelError",
  code: ChannelErrorCode.UNIQUE,
  field: "slug",
  message: null,
});

export type CreateChannelDialogInitialValues = ChannelCreateFormData & {
  countryDisplayName?: string;
};

interface CreateChannelDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryFragment[];
  disabled?: boolean;
  errors: ChannelErrorFragment[];
  /** Prefill when duplicating an existing channel. */
  initialValues?: CreateChannelDialogInitialValues;
  /** Switches copy to the duplicate-channel title and description. */
  isDuplicate?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChannelCreateFormData) => SubmitPromise<ChannelErrorFragment[]>;
}

interface CreateChannelDialogFormContentProps {
  apiErrors: ChannelErrorFragment[];
  change: FormChange;
  confirmButtonState: ConfirmButtonTransitionState;
  countryChoices: Option[];
  currencyManuallyEdited: boolean;
  data: ChannelCreateFormData;
  disabled: boolean;
  isDuplicate: boolean;
  onClose: () => void;
  selectedCountryDisplayName: string;
  selectedCurrencyCode: string;
  set: (data: Partial<ChannelCreateFormData>) => void;
  setCurrencyManuallyEdited: (value: boolean) => void;
  setSelectedCountryDisplayName: (value: string) => void;
  setSelectedCurrencyCode: (value: string) => void;
  setSlugManuallyEdited: (value: boolean) => void;
  setSubmitErrors: Dispatch<SetStateAction<ChannelErrorFragment[]>>;
  slugManuallyEdited: boolean;
  submit: () => void;
  submitErrors: ChannelErrorFragment[];
}

const CreateChannelDialogFormContent = ({
  apiErrors,
  change,
  confirmButtonState,
  countryChoices,
  currencyManuallyEdited,
  data,
  disabled,
  isDuplicate,
  onClose,
  selectedCountryDisplayName,
  selectedCurrencyCode,
  set,
  setCurrencyManuallyEdited,
  setSelectedCountryDisplayName,
  setSelectedCurrencyCode,
  setSlugManuallyEdited,
  setSubmitErrors,
  slugManuallyEdited,
  submit,
  submitErrors,
}: CreateChannelDialogFormContentProps) => {
  const intl = useIntl();
  // Macaw may echo programmatic currency updates via onChange — don't treat those as manual.
  const pendingSuggestedCurrencyRef = useRef<string | null>(null);
  const { isChecking: isSlugChecking, isTaken: isSlugTaken } = useChannelSlugAvailability(
    data.slug,
  );

  const slugAvailabilityErrors = isSlugTaken ? [createSlugTakenError()] : [];
  const allErrors = [...apiErrors, ...submitErrors, ...slugAvailabilityErrors];
  const formErrors = getFormErrors<keyof ChannelCreateFormData, ChannelErrorFragment>(
    ["name", "slug", "currencyCode", "defaultCountry"],
    allErrors,
  );
  const nameError = getChannelsErrorMessage(formErrors?.name, intl);
  const slugError = getChannelsErrorMessage(formErrors?.slug, intl);
  const countryError = getChannelsErrorMessage(formErrors?.defaultCountry, intl);
  const currencyError = getChannelsErrorMessage(formErrors?.currencyCode, intl);

  const handleNameChange = (event: ChangeEvent) => {
    change(event);

    if (!slugManuallyEdited) {
      const nextName = typeof event.target.value === "string" ? event.target.value : "";

      change({
        target: {
          name: "slug",
          value: slugify(nextName).toLowerCase(),
        },
      });
    }
  };

  const handleSlugChange = (event: ChangeEvent) => {
    setSlugManuallyEdited(true);
    setSubmitErrors(errors => errors.filter(error => error.field !== "slug"));
    change(event);
  };

  const handleCurrencyCodeChange = (currencyCode: string) => {
    const nextCurrencyCode = currencyCode.trim();

    setSelectedCurrencyCode(nextCurrencyCode);
    change({
      target: {
        name: "currencyCode",
        value: nextCurrencyCode,
      },
    });

    const nextAutosuggestState = resolveCurrencyManualEditAfterChange(
      {
        currencyManuallyEdited,
        pendingSuggestedCurrency: pendingSuggestedCurrencyRef.current,
      },
      nextCurrencyCode,
    );

    pendingSuggestedCurrencyRef.current = nextAutosuggestState.pendingSuggestedCurrency;
    setCurrencyManuallyEdited(nextAutosuggestState.currencyManuallyEdited);
  };

  const applySuggestedCurrency = (countryCode: string) => {
    const { state: nextAutosuggestState, suggested } = suggestCurrencyForCountry(
      {
        currencyManuallyEdited,
        pendingSuggestedCurrency: pendingSuggestedCurrencyRef.current,
      },
      countryCode,
      getSuggestedCurrencyCode,
    );

    pendingSuggestedCurrencyRef.current = nextAutosuggestState.pendingSuggestedCurrency;

    if (suggested) {
      set({ currencyCode: suggested });
      setSelectedCurrencyCode(suggested);
    }
  };

  const handleDefaultCountryChange = (event: ChangeEvent) => {
    createSingleAutocompleteSelectHandler(
      change,
      setSelectedCountryDisplayName,
      countryChoices,
    )(event);

    applySuggestedCurrency(String(event.target.value));
  };

  const canSubmit =
    !!data.name.trim() &&
    !!data.slug.trim() &&
    !!data.currencyCode &&
    !!data.defaultCountry &&
    !isSlugTaken &&
    !isSlugChecking;

  return (
    <DashboardModal.Content disableAutofocus size="sm" data-test-id="create-channel-dialog">
      <DashboardModal.Header
        subtitle={
          <FormattedMessage
            {...(isDuplicate ? messages.duplicateDescription : messages.description)}
          />
        }
      >
        <Box as="span" display="inline-flex" alignItems="center" gap={2}>
          <Globe
            size={iconSize.medium}
            strokeWidth={iconStrokeWidthBySize.medium}
            aria-hidden="true"
          />
          <FormattedMessage {...(isDuplicate ? messages.duplicateTitle : messages.title)} />
        </Box>
      </DashboardModal.Header>

      <DashboardModal.Body>
        <DashboardModal.Inset>
          <Box display="flex" flexDirection="column" gap={4}>
            <Input
              name="name"
              label={intl.formatMessage(channelFormMessages.channelName)}
              helperText={nameError || intl.formatMessage(channelFormMessages.channelNameHint)}
              error={!!formErrors.name}
              value={data.name}
              onChange={handleNameChange}
              disabled={disabled}
              data-test-id="channel-name-input"
              autoFocus
            />
            <Input
              name="slug"
              label={intl.formatMessage(channelFormMessages.channelSlug)}
              helperText={slugError || intl.formatMessage(channelFormMessages.channelSlugHint)}
              error={!!formErrors.slug}
              value={data.slug}
              onChange={handleSlugChange}
              disabled={disabled}
              data-test-id="slug-name-input"
            />
            <Box
              display="flex"
              flexDirection={{ mobile: "column", tablet: "row", desktop: "row" }}
              gap={4}
            >
              <Box __flex="1 1 0" __minWidth="0" width="100%">
                <DynamicCombobox
                  data-test-id="country-select-input"
                  disabled={disabled}
                  error={!!formErrors.defaultCountry}
                  label={intl.formatMessage(channelFormMessages.defaultCountry)}
                  helperText={
                    countryError || intl.formatMessage(channelFormMessages.defaultCountryHint)
                  }
                  options={countryChoices}
                  name="defaultCountry"
                  // Empty string value floats the label as if selected — use null like Currency.
                  value={
                    data.defaultCountry
                      ? {
                          label: selectedCountryDisplayName,
                          value: data.defaultCountry,
                        }
                      : null
                  }
                  onChange={option =>
                    handleDefaultCountryChange({
                      target: {
                        value: option?.value ?? "",
                        name: "defaultCountry",
                      },
                    })
                  }
                />
              </Box>
              <Box __flex="1 1 0" __minWidth="0" width="100%">
                <CurrencyCodeCombobox
                  data-test-id="channel-currency-select-input"
                  disabled={disabled}
                  error={!!formErrors.currencyCode}
                  label={intl.formatMessage(channelFormMessages.channelCurrency)}
                  helperText={
                    currencyError ||
                    intl.formatMessage(channelFormMessages.channelCurrencyHintCreate)
                  }
                  name="currencyCode"
                  value={selectedCurrencyCode || data.currencyCode}
                  onChange={handleCurrencyCodeChange}
                />
              </Box>
            </Box>
          </Box>
        </DashboardModal.Inset>
      </DashboardModal.Body>

      <DashboardModal.Actions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          onClick={submit}
          disabled={disabled || !canSubmit}
          data-test-id="submit"
        >
          <FormattedMessage {...messages.submit} />
        </ConfirmButton>
      </DashboardModal.Actions>
    </DashboardModal.Content>
  );
};

export const CreateChannelDialog = ({
  confirmButtonState,
  countries,
  disabled = false,
  errors: apiErrors,
  initialValues,
  isDuplicate = false,
  open,
  onClose,
  onSubmit,
}: CreateChannelDialogProps) => {
  const [submitErrors, setSubmitErrors] = useState<ChannelErrorFragment[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [currencyManuallyEdited, setCurrencyManuallyEdited] = useState(false);
  const [selectedCountryDisplayName, setSelectedCountryDisplayName] = useState("");
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  // null = not synced yet, so the first open (including mount-with-open) still resets.
  const [prevOpen, setPrevOpen] = useState<boolean | null>(null);

  const countryChoices = useMemo(() => mapCountriesToChoices(countries || []), [countries]);

  const initialForm: ChannelCreateFormData = {
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    currencyCode: initialValues?.currencyCode ?? "",
    defaultCountry: initialValues?.defaultCountry ?? "",
  };

  // Adjust state while rendering when `open` changes so the first paint already
  // has a fresh Form — remounting from an effect flashes the modal for a frame.
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prevOpen !== open) {
    setPrevOpen(open);

    if (open) {
      setSubmitErrors([]);
      // Prefills are intentional — don't let name/country autosuggest overwrite them.
      setSlugManuallyEdited(Boolean(initialValues?.slug));
      setCurrencyManuallyEdited(Boolean(initialValues?.currencyCode));
      setSelectedCountryDisplayName(initialValues?.countryDisplayName ?? "");
      setSelectedCurrencyCode(initialValues?.currencyCode ?? "");
      setFormKey(current => current + 1);
    } else if (prevOpen === true) {
      setSubmitErrors([]);
      setSlugManuallyEdited(false);
      setCurrencyManuallyEdited(false);
      setSelectedCountryDisplayName("");
      setSelectedCurrencyCode("");
    }
  }

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form
          key={formKey}
          initial={initialForm}
          onSubmit={async data => {
            const validationErrors = validateChannelCreateFormData(data);

            if (validationErrors.length) {
              setSubmitErrors(validationErrors);

              return validationErrors;
            }

            const errors = await onSubmit(data);

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, set, submit }) => (
            <CreateChannelDialogFormContent
              apiErrors={apiErrors}
              change={change}
              confirmButtonState={confirmButtonState}
              countryChoices={countryChoices}
              currencyManuallyEdited={currencyManuallyEdited}
              data={data}
              disabled={disabled}
              isDuplicate={isDuplicate}
              onClose={onClose}
              selectedCountryDisplayName={selectedCountryDisplayName}
              selectedCurrencyCode={selectedCurrencyCode}
              set={set}
              setCurrencyManuallyEdited={setCurrencyManuallyEdited}
              setSelectedCountryDisplayName={setSelectedCountryDisplayName}
              setSelectedCurrencyCode={setSelectedCurrencyCode}
              setSlugManuallyEdited={setSlugManuallyEdited}
              setSubmitErrors={setSubmitErrors}
              slugManuallyEdited={slugManuallyEdited}
              submit={submit}
              submitErrors={submitErrors}
            />
          )}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
