
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { getStoreBuilder } from 'vuex-typex';
import { MessageState } from './modules/message';
import  "./modules"
export * from "./modules"
export interface RootState
{
    message: MessageState
}

Vue.use(Vuex)
const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore() 
export default store // <-- "store" to provide to root Vue