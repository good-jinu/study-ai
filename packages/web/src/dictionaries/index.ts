const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  ko: () => import("./ko.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: string) => {
  if (Object.keys(dictionaries).includes(locale)) {
    return dictionaries[locale as Locale]();
  }
  return dictionaries.en();
};
