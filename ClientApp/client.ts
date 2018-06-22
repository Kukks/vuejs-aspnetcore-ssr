import * as NProgress from 'nprogress'
import "./styles/app.scss";
import {
    app,
    router,
    store
} from './app'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'


declare const __INITIAL_STATE__:any;

Vue.use(BootstrapVue)
store.replaceState(__INITIAL_STATE__)

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // compare two list of components from previous route and current route
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    // if no new components loaded, do nothing
    if (!activated.length) {
      return next()
    }

    NProgress.start()

    // for each newly loaded components, asynchorously load data to them
    Promise.all(activated.map(c => {
      if ((c as any).asyncData) {
        return (c as any).asyncData({store, route: to})
      }
    })).then(() => {
      NProgress.done()
      next()
    }).catch(next)
  })
  app.$mount('#app')
})
