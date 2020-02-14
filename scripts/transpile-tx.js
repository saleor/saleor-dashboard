/* eslint-disable @typescript-eslint/no-var-requires */
const {
  createSingleMessagesFile,
  default: manageTranslations
} = require("react-intl-translations-manager");

const dotSeparator = "_dot_";
const sortKeys = true;
const translationsDirectory = "locale";

manageTranslations({
  messagesDirectory: "build/locale/src",
  overrideCoreMethods: {
    outputSingleFile: combinedFiles => {
      const msgDescriptors = combinedFiles.reduce(
        (acc, messages) => [...acc, ...messages.descriptors],
        []
      );
      const structuredJsonFormat = msgDescriptors.reduce((msgs, msg) => {
        const key = msg.id.replace(/\./g, dotSeparator);
        if (msgs[key] && msgs[key].context === undefined) {
          msgs[key].context = msg.description;
        } else {
          msgs[key] = {
            context: msg.description,
            string: msg.defaultMessage
          };
        }

        return msgs;
      }, {});

      createSingleMessagesFile({
        directory: translationsDirectory,
        messages: structuredJsonFormat,
        sortKeys
      });
    }
  },
  singleMessagesFile: true,
  sortKeys,
  translationsDirectory
});
