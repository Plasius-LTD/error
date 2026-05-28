import { createI18n } from "@plasius/translations";
import type { TranslationArgs, TranslationDictionary } from "@plasius/translations";
import { errorBoundaryEnGbTranslations } from "./translations/en-GB.js";

export const errorBoundaryTranslationKeys = {
  defaultFallback: "error.boundary.defaultFallback",
} as const;

export type ErrorBoundaryTranslationKey =
  (typeof errorBoundaryTranslationKeys)[keyof typeof errorBoundaryTranslationKeys];

export type ErrorBoundaryTranslate = (
  key: ErrorBoundaryTranslationKey,
  args?: TranslationArgs
) => string | undefined;

export const errorBoundaryTranslations = {
  "en-GB": errorBoundaryEnGbTranslations,
} satisfies Partial<Record<string, TranslationDictionary>>;

const errorBoundaryI18n = createI18n({
  language: "en-GB",
  fallback: "en-GB",
  translations: errorBoundaryTranslations,
});

export function translateErrorBoundaryText(
  key: ErrorBoundaryTranslationKey,
  args?: TranslationArgs,
  translate?: ErrorBoundaryTranslate
): string {
  const translated = translate?.(key, args);
  if (translated && translated !== key) {
    return translated;
  }

  return errorBoundaryI18n.t(key, args);
}

