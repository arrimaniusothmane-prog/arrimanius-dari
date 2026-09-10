"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "./i18n-provider";
import { AuthProvider } from "./auth-provider";
import { LocaleDocumentSync } from "./locale-document-sync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <LocaleDocumentSync />
        {children}
      </AuthProvider>
    </I18nProvider>
  );
}