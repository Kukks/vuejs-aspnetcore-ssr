import { app, router, store } from "./app";

export default (context: { url: string; state: any }) => {
  return new Promise((resolve, reject) => {
    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject(new Error({ code: 404 } as any));
      }
      Promise.all(
        matchedComponents.map(Component => {
          if ((Component as any).asyncData) {
            return (Component as any).asyncData({ store, context });
          }
        })
      )
        .then(() => {
          context.state = store.state;
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
