/* eslint-disable */
import { Locales } from 'intlayer';
import _tFoXhcysLteaPab3y113 from './barcode.ts';

declare module 'intlayer' {
  interface IntlayerDictionaryTypesConnector {
    "barcode": typeof _tFoXhcysLteaPab3y113;
  }

  type DeclaredLocales = Locales.ENGLISH;
  type RequiredLocales = Locales.ENGLISH;
  type ExtractedLocales = Extract<Locales, RequiredLocales>;
  type ExcludedLocales = Exclude<Locales, RequiredLocales>;
  interface IConfigLocales<Content> extends Record<ExtractedLocales, Content>, Partial<Record<ExcludedLocales, Content>> {}
}