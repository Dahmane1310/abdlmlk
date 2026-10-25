/**
 * comment router
 *
 * Public, custom endpoints only. Comments are managed in the admin panel.
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/comments',
      handler: 'api::comment.comment.list',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/comments',
      handler: 'api::comment.comment.submit',
      config: {
        auth: false,
        middlewares: [{ name: 'global::spam-guard', config: { max: 5, windowMs: 10 * 60 * 1000 } }],
      },
    },
  ],
};
