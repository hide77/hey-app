import I18n, { getLanguages } from "react-native-i18n";
import en from "./locales/en";
import fr from "./locales/fr";

getLanguages().then(languages => {
  // console.log({ languages:languages[0] }); // ['en-US', 'en']
});

I18n.fallbacks = true;

I18n.translations = { en, fr };

export default I18n;
