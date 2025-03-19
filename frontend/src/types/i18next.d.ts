import 'i18next';
import type { resources } from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
