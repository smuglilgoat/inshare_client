import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'viewerjs/dist/viewer.css';
import '@mdi/font/css/materialdesignicons.css';
import Viewer from 'v-viewer';
import VoerroTagsInput from '@voerro/vue-tagsinput';
import colors from 'vuetify/es5/util/colors';

Vue.component('tags-input', VoerroTagsInput);
Vue.use(Viewer);
Vue.use(Vuetify, {
	iconfont: 'mdi',
	theme: {
		primary: colors.blue.darken3
	}
});
window.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3333';
const token = localStorage.getItem('token');
if (token) {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

Vue.config.productionTip = false;

sync(store, router);
new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
