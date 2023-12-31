import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 导入组件库
import HFILEPreview from './../packages/index'
// 注册组件库
Vue.use(HFILEPreview)
new Vue({
  render: h => h(App),
}).$mount('#app')
