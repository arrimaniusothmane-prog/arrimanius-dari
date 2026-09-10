"use client";

import { useEffect } from "react";
import { useI18n } from "./i18n-provider";

const dirByLocale = { fr: "ltr", en: "ltr", ar: "rtl" } as const;

export function LocaleDocumentSync() {
  const { locale } = useI18n();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirByLocale[locale];
  }, [locale]);

  return null;
}