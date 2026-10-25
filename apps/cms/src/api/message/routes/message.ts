/**
 * message router
 *
 * Public contact endpoint. Messages are read in the admin panel.
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/contact',
      handler: 'api::message.message.submit',
      config: {
        auth: false,
        middlewares: [{ name: 'global::spam-guard', config: { max: 3, windowMs: 60 * 60 * 1000 } }],
      },
    },
  ],
};
