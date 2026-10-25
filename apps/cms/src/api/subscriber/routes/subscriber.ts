/**
 * subscriber router
 *
 * Public newsletter endpoints. Subscribers are managed in the admin panel.
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/newsletter/subscribe',
      handler: 'api::subscriber.subscriber.subscribe',
      config: {
        auth: false,
        middlewares: [{ name: 'global::spam-guard', config: { max: 3, windowMs: 60 * 60 * 1000 } }],
      },
    },
    {
      method: 'GET',
      path: '/newsletter/confirm',
      handler: 'api::subscriber.subscriber.confirm',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/newsletter/unsubscribe',
      handler: 'api::subscriber.subscriber.unsubscribe',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/newsletter/unsubscribe',
      handler: 'api::subscriber.subscriber.unsubscribe',
      config: { auth: false },
    },
  ],
};
