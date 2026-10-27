/**
 * like router
 *
 * Public, custom endpoints only. Likes are never edited in the admin panel.
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/likes',
      handler: 'api::like.like.total',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/likes',
      handler: 'api::like.like.set',
      config: {
        auth: false,
        // No captcha: there's no form to show it in. One like per visitor is
        // enforced by the controller; the limit only stops endless toggling.
        middlewares: [{ name: 'global::spam-guard', config: { max: 30, windowMs: 10 * 60 * 1000, captcha: false } }],
      },
    },
  ],
};
