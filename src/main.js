import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// add these before Vue is instantiated

Vue.use(BootstrapVue);
Vue.use(VeeValidate, {
	// This is the default
	inject: true,
	// Important to name this something other than 'fields'
	fieldsBagName: 'veeFields'
});
sync(store, router);
new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
