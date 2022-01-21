import App from './App'


import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
import uView from "./components/uview-ui";
Vue.use(uView);
const app = new Vue({
    ...App
})
app.$mount()

