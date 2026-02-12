"use client";

import { createContext, useContext, ReactNode } from "react";
import { getDictionary } from "@/dictionaries";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext);
  if (dictionary === null) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return dictionary;
}
