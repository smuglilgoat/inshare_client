import Vue from 'vue';
import VeeValidate from 'vee-validate';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false;

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// add these before Vue is instantiated
window.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3333';
Vue.use(BootstrapVue);
Vue.use(VeeValidate, {
	// This is the default
	inject: true,
	// Important to name this something other than 'fields'
	fieldsBagName: 'veeFields'
})
new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
