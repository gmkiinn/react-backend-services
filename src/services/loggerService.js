import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

function init() {
  Sentry.init({
    dsn: 'https://1b36792bcac64c8ba11c58fafa8f4edb@o524407.ingest.sentry.io/6110039',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0,
  });
}

const captureException = Sentry.captureException;
const captureMessage = Sentry.captureMessage;

export default {
  init,
  captureException,
  captureMessage,
};
