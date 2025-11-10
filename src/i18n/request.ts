import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Always use Spanish locale
  const locale = 'es';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
